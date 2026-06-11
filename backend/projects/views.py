from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Milestone, MilestoneComment, Project
from .serializers import (
    MilestoneCommentSerializer,
    MilestoneSerializer,
    ProjectListSerializer,
    ProjectSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Project.objects.filter(user=self.request.user)
        if self.action == "list":
            return qs.annotate(
                milestone_count=Count("milestones"),
                completed_milestone_count=Count(
                    "milestones", filter=Q(milestones__completed=True)
                ),
                todo_milestone_count=Count(
                    "milestones",
                    filter=Q(milestones__bucket_status=Milestone.BucketStatus.TODO),
                ),
                in_progress_milestone_count=Count(
                    "milestones",
                    filter=Q(milestones__bucket_status=Milestone.BucketStatus.IN_PROGRESS),
                ),
                done_milestone_count=Count(
                    "milestones",
                    filter=Q(milestones__bucket_status=Milestone.BucketStatus.DONE),
                ),
            )
        return qs.prefetch_related("milestones", "board")

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MilestoneListCreateView(generics.ListCreateAPIView):
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Milestone.objects.filter(
            project_id=self.kwargs["project_id"],
            project__user=self.request.user,
        )

    def perform_create(self, serializer):
        from kanban.sync import create_card_for_milestone

        project = Project.objects.get(
            id=self.kwargs["project_id"],
            user=self.request.user,
        )
        milestone = serializer.save(project=project)
        create_card_for_milestone(milestone)


class MilestoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "milestone_id"

    def get_queryset(self):
        return Milestone.objects.filter(
            project_id=self.kwargs["project_id"],
            project__user=self.request.user,
        )

    def perform_update(self, serializer):
        from kanban.sync import sync_milestone_card_content

        milestone = serializer.save()
        sync_milestone_card_content(milestone)


class MilestoneCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = MilestoneCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MilestoneComment.objects.filter(
            milestone_id=self.kwargs["milestone_id"],
            milestone__project_id=self.kwargs["project_id"],
            milestone__project__user=self.request.user,
        ).select_related("user")

    def perform_create(self, serializer):
        milestone = get_object_or_404(
            Milestone,
            id=self.kwargs["milestone_id"],
            project_id=self.kwargs["project_id"],
            project__user=self.request.user,
        )
        serializer.save(user=self.request.user, milestone=milestone)


class MilestoneCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MilestoneCommentSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "comment_id"

    def get_queryset(self):
        return MilestoneComment.objects.filter(
            milestone_id=self.kwargs["milestone_id"],
            milestone__project_id=self.kwargs["project_id"],
            milestone__project__user=self.request.user,
        ).select_related("user")

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in ("GET", "HEAD", "OPTIONS") and obj.user_id != request.user.id:
            raise PermissionDenied("You can only edit your own comments.")

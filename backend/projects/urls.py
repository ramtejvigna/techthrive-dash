from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    MilestoneCommentDetailView,
    MilestoneCommentListCreateView,
    MilestoneDetailView,
    MilestoneListCreateView,
    ProjectViewSet,
)

router = DefaultRouter()
router.register("", ProjectViewSet, basename="project")

urlpatterns = [
    path(
        "<uuid:project_id>/milestones/",
        MilestoneListCreateView.as_view(),
        name="project-milestones",
    ),
    path(
        "<uuid:project_id>/milestones/<uuid:milestone_id>/",
        MilestoneDetailView.as_view(),
        name="project-milestone-detail",
    ),
    path(
        "<uuid:project_id>/milestones/<uuid:milestone_id>/comments/",
        MilestoneCommentListCreateView.as_view(),
        name="project-milestone-comments",
    ),
    path(
        "<uuid:project_id>/milestones/<uuid:milestone_id>/comments/<uuid:comment_id>/",
        MilestoneCommentDetailView.as_view(),
        name="project-milestone-comment-detail",
    ),
    *router.urls,
]

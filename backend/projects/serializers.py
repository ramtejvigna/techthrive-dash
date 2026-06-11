from accounts.serializers import UserSerializer
from rest_framework import serializers

from .models import Milestone, MilestoneComment, Project


class MilestoneCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MilestoneComment
        fields = ("id", "body", "user", "created_at", "updated_at")
        read_only_fields = ("id", "user", "created_at", "updated_at")


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = (
            "id",
            "title",
            "target_date",
            "bucket_status",
            "completed",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "bucket_status", "completed", "created_at", "updated_at")


class ProjectSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    board_id = serializers.UUIDField(source="board.id", read_only=True, allow_null=True)
    board_title = serializers.CharField(source="board.title", read_only=True, allow_null=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "due_date",
            "board",
            "board_id",
            "board_title",
            "milestones",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_board(self, board):
        if board is None:
            return board
        user = self.context["request"].user
        if board.user_id != user.id:
            raise serializers.ValidationError("Board not found.")
        return board

    def create(self, validated_data):
        from kanban.sync import sync_project_milestones_to_board

        project = super().create(validated_data)
        if project.board_id:
            sync_project_milestones_to_board(project)
        return project

    def update(self, instance, validated_data):
        from kanban.sync import delete_milestone_cards_for_project, sync_project_milestones_to_board

        old_board_id = instance.board_id
        project = super().update(instance, validated_data)

        if old_board_id and old_board_id != project.board_id:
            delete_milestone_cards_for_project(project)

        if project.board_id:
            sync_project_milestones_to_board(project)

        return project


class ProjectListSerializer(serializers.ModelSerializer):
    milestone_count = serializers.IntegerField(read_only=True)
    completed_milestone_count = serializers.IntegerField(read_only=True)
    todo_milestone_count = serializers.IntegerField(read_only=True)
    in_progress_milestone_count = serializers.IntegerField(read_only=True)
    done_milestone_count = serializers.IntegerField(read_only=True)
    board_id = serializers.UUIDField(source="board.id", read_only=True, allow_null=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "due_date",
            "board_id",
            "milestone_count",
            "completed_milestone_count",
            "todo_milestone_count",
            "in_progress_milestone_count",
            "done_milestone_count",
            "created_at",
            "updated_at",
        )

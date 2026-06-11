from django.contrib import admin

from .models import Milestone, MilestoneComment, Project


class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "user", "due_date", "updated_at")
    list_filter = ("status",)
    search_fields = ("name",)
    inlines = [MilestoneInline]


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "target_date", "completed")
    list_filter = ("completed",)


@admin.register(MilestoneComment)
class MilestoneCommentAdmin(admin.ModelAdmin):
    list_display = ("milestone", "user", "created_at")
    search_fields = ("body", "milestone__title", "user__email")

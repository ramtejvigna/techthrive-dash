"use client";

import { PageHeader } from "@/components/layout/page-header";
import { MilestoneList } from "@/components/projects/milestone-list";
import { ProjectForm } from "@/components/projects/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { api } from "@/lib/api";
import type { Board, Milestone, Project, User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  async function loadProject() {
    const [projectData, boardData, userData] = await Promise.all([
      api.getProject(params.id),
      api.getBoards(),
      api.me(),
    ]);
    setProject(projectData);
    setBoards(boardData);
    setCurrentUser(userData);
  }

  useEffect(() => {
    loadProject().finally(() => setLoading(false));
  }, [params.id]);

  async function handleUpdate(data: {
    name: string;
    description: string;
    status: Project["status"];
    due_date: string | null;
    board: string | null;
  }) {
    await api.updateProject(params.id, data);
    setEditOpen(false);
    await loadProject();
  }

  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    await api.deleteProject(params.id);
    router.push("/dashboard/projects");
  }

  async function handleCreateMilestone(data: {
    title: string;
    target_date: string | null;
  }) {
    await api.createMilestone(params.id, data);
    await loadProject();
  }

  async function handleToggleMilestone(milestone: Milestone) {
    await api.updateMilestone(params.id, milestone.id, {
      completed: !milestone.completed,
    });
    await loadProject();
  }

  async function handleDeleteMilestone(milestoneId: string) {
    await api.deleteMilestone(params.id, milestoneId);
    await loadProject();
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Project" />
        <div className="px-6 pb-10 font-mono text-sm text-[var(--muted)] md:px-8">
          loading...
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <PageHeader title="Project" />
        <div className="px-6 pb-10 text-sm text-red-500 md:px-8">Project not found.</div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description={project.description || "Project details"}
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      />
      <div className="space-y-6 px-6 pb-10 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardDescription>Status</CardDescription>
            <div className="mt-2">
              <Badge>{project.status.replace("_", " ")}</Badge>
            </div>
          </Card>
          <Card>
            <CardDescription>Due date</CardDescription>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {formatDate(project.due_date)}
            </p>
          </Card>
          <Card>
            <CardDescription>Linked board</CardDescription>
            {project.board_id ? (
              <Link
                href={`/dashboard/kanban/${project.board_id}`}
                className="mt-2 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {project.board_title || "Open board"}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">No board linked</p>
            )}
          </Card>
        </div>

        <Card>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>Track key deliverables for this project.</CardDescription>
          <div className="mt-4">
            <MilestoneList
              projectId={params.id}
              milestones={project.milestones || []}
              currentUser={currentUser}
              boardLinked={Boolean(project.board_id)}
              onCreate={handleCreateMilestone}
              onToggle={project.board_id ? undefined : handleToggleMilestone}
              onDelete={handleDeleteMilestone}
            />
          </div>
        </Card>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit project">
        <ProjectForm
          initial={project}
          boards={boards}
          onSubmit={handleUpdate}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </>
  );
}

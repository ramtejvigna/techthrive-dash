"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Board, Project } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function loadData() {
    const [projectData, boardData] = await Promise.all([
      api.getProjects(),
      api.getBoards(),
    ]);
    setProjects(projectData);
    setBoards(boardData);
  }

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: {
    name: string;
    description: string;
    status: Project["status"];
    due_date: string | null;
    board: string | null;
  }) {
    await api.createProject(data);
    setModalOpen(false);
    await loadData();
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track milestones and link boards to your work."
        actions={
          <Button onClick={() => setModalOpen(true)}>+ New Project</Button>
        }
      />
      <div className="px-6 pb-10 md:px-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <FadeIn>
            <div className="tech-frame flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] py-20 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                // empty_state
              </p>
              <p className="mt-2 text-lg font-semibold">No projects found</p>
              <p className="mt-1 max-w-sm font-mono text-xs text-[var(--muted)]">
                initialize your first project to begin tracking
              </p>
              <Button className="mt-6 font-mono text-xs uppercase tracking-wider" onClick={() => setModalOpen(true)}>
                + new_project()
              </Button>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New project"
      >
        <ProjectForm
          boards={boards}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          submitLabel="Create project"
        />
      </Modal>
    </>
  );
}

"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Board } from "@/lib/types";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function KanbanListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadBoards() {
    const data = await api.getBoards();
    setBoards(data);
  }

  useEffect(() => {
    loadBoards().finally(() => setLoading(false));
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await api.createBoard({ title: title.trim() });
      setTitle("");
      setModalOpen(false);
      await loadBoards();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Kanban"
        description="Organize work with drag-and-drop boards."
        actions={<Button onClick={() => setModalOpen(true)}>+ New Board</Button>}
      />
      <div className="px-6 pb-10 md:px-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <FadeIn>
            <div className="tech-frame flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] py-20 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                // empty_state
              </p>
              <p className="mt-2 text-lg font-semibold">No boards found</p>
              <p className="mt-1 max-w-sm font-mono text-xs text-[var(--muted)]">
                deploy a kanban board with default columns
              </p>
              <Button className="mt-6 font-mono text-xs uppercase tracking-wider" onClick={() => setModalOpen(true)}>
                + new_board()
              </Button>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {boards.map((board, index) => (
              <Link key={board.id} href={`/dashboard/kanban/${board.id}`}>
                <Card hover delay={index * 0.06}>
                  <CardTitle>{board.title}</CardTitle>
                  <CardDescription>
                    {board.column_count ?? 0} columns · {board.card_count ?? 0} cards
                  </CardDescription>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: Math.min(board.column_count ?? 3, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className="h-0.5 flex-1 rounded-full bg-[var(--accent)]/30"
                      />
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New board"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Sprint planning, Content pipeline..."
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create board"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

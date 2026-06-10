"use client";

import { MilestoneProgressFromList } from "@/components/projects/milestone-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MILESTONE_STATUS_LABELS,
  MILESTONE_STATUS_VARIANTS,
} from "@/lib/milestone-status";
import type { Milestone } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FormEvent, useState } from "react";

interface MilestoneListProps {
  milestones: Milestone[];
  boardLinked?: boolean;
  onCreate: (data: { title: string; target_date: string | null }) => Promise<void>;
  onToggle?: (milestone: Milestone) => Promise<void>;
  onDelete: (milestoneId: string) => Promise<void>;
}

export function MilestoneList({
  milestones,
  boardLinked = false,
  onCreate,
  onToggle,
  onDelete,
}: MilestoneListProps) {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onCreate({ title: title.trim(), target_date: targetDate || null });
      setTitle("");
      setTargetDate("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* <MilestoneProgressFromList milestones={milestones} /> */}

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
        <Input
          label="New milestone"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Milestone title"
          className="min-w-[200px] flex-1"
        />
        <Input
          label="Target date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          Add
        </Button>
      </form>

      <ul className="space-y-2">
        {milestones.length === 0 ? (
          <li className="text-sm text-[var(--muted)]">No milestones yet.</li>
        ) : (
          milestones.map((milestone) => {
            const status = milestone.bucket_status || (milestone.completed ? "done" : "todo");

            return (
              <li
                key={milestone.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {!boardLinked && onToggle ? (
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => onToggle(milestone)}
                      className="h-4 w-4 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent)]"
                    />
                  ) : (
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        status === "done"
                          ? "bg-emerald-500"
                          : status === "in_progress"
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--surface-subtle)]"
                      }`}
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          milestone.completed
                            ? "text-sm text-[var(--muted)] line-through"
                            : "text-sm font-medium text-[var(--foreground)]"
                        }
                      >
                        {milestone.title}
                      </span>
                      <Badge variant={MILESTONE_STATUS_VARIANTS[status]}>
                        {MILESTONE_STATUS_LABELS[status]}
                      </Badge>
                    </div>
                    <span className="mt-0.5 block font-mono text-[10px] text-[var(--muted)]">
                      {formatDate(milestone.target_date)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(milestone.id)}
                  className="shrink-0 text-red-600"
                >
                  Delete
                </Button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

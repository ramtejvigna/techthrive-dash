"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { MilestoneComment, User } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { FormEvent, useEffect, useState } from "react";

interface MilestoneCommentsProps {
  projectId: string;
  milestoneId: string;
  currentUser: User | null;
}

export function MilestoneComments({
  projectId,
  milestoneId,
  currentUser,
}: MilestoneCommentsProps) {
  const [comments, setComments] = useState<MilestoneComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    setLoading(true);
    try {
      const data = await api.getMilestoneComments(projectId, milestoneId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [projectId, milestoneId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const comment = await api.createMilestoneComment(projectId, milestoneId, trimmed);
      setComments((prev) => [...prev, comment]);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    await api.deleteMilestoneComment(projectId, milestoneId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-3">
      {loading ? (
        <p className="text-xs text-[var(--muted)]">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-md bg-[var(--surface-subtle)] px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--foreground)]">
                    {comment.user.email}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--foreground)]">
                    {comment.body}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                    {formatDateTime(comment.created_at)}
                  </p>
                </div>
                {currentUser?.id === comment.user.id && (
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(comment.id)}
                    className="shrink-0 text-xs text-red-600"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
        />
        <Button
          type="submit"
          className="px-3 py-1.5 text-xs"
          disabled={submitting || !body.trim()}
        >
          Post comment
        </Button>
      </form>
    </div>
  );
}

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLink,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MoreIcon,
} from "@/components/ui/dropdown-menu";
import type { LinkedProject } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface BoardHeaderProps {
  title: string;
  columnCount: number;
  cardCount: number;
  linkedProjects?: LinkedProject[];
  editingTitle: boolean;
  onStartEditTitle: () => void;
  onCancelEditTitle: () => void;
  onSaveTitle: (title: string) => Promise<void>;
  onAddBucket: () => void;
  onDeleteBoard?: () => void;
}

export function BoardHeader({
  title,
  columnCount,
  cardCount,
  linkedProjects = [],
  editingTitle,
  onStartEditTitle,
  onCancelEditTitle,
  onSaveTitle,
  onAddBucket,
  onDeleteBoard,
}: BoardHeaderProps) {
  const [draft, setDraft] = useState(title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingTitle) {
      setDraft(title);
    }
  }, [title, editingTitle]);

  useEffect(() => {
    if (editingTitle) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingTitle]);

  async function commitTitle() {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === title) {
      onCancelEditTitle();
      setDraft(title);
      return;
    }

    setSaving(true);
    try {
      await onSaveTitle(trimmed);
      onCancelEditTitle();
    } catch {
      setDraft(title);
      onCancelEditTitle();
    } finally {
      setSaving(false);
    }
  }

  function handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void commitTitle();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(title);
      onCancelEditTitle();
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-8"
    >
      <div className="min-w-0 flex-1">
        <p className="tech-label">kanban_board</p>

        {editingTitle ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => void commitTitle()}
            onKeyDown={handleTitleKeyDown}
            disabled={saving}
            maxLength={120}
            className={cn(
              "mt-1 w-full max-w-xl rounded-lg border border-[var(--accent)]/40 bg-[var(--surface)] px-2 py-1",
              "text-2xl font-semibold tracking-tight text-[var(--foreground)] shadow-sm",
              "outline-none ring-2 ring-[var(--accent)]/20",
            )}
            aria-label="Board title"
          />
        ) : (
          <button
            type="button"
            onClick={onStartEditTitle}
            className={cn(
              "mt-1 block max-w-full truncate text-left text-2xl font-semibold tracking-tight text-[var(--foreground)]",
              "rounded-md transition-colors hover:text-[var(--accent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30",
            )}
            title="Click to rename board"
          >
            {title}
          </button>
        )}

        <p className="mt-1 font-mono text-xs text-[var(--muted)]">
          {columnCount} buckets · {cardCount} pages · hold and drag to reorder
        </p>
        {linkedProjects.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Linked projects
            </span>
            {linkedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)] shadow-sm transition-colors hover:bg-[var(--accent-light)]"
              >
                {project.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Board options" />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onStartEditTitle}>Rename board</DropdownMenuItem>
          <DropdownMenuItem onClick={onAddBucket}>Add bucket</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLink href="/dashboard/kanban">All boards</DropdownMenuLink>
          {onDeleteBoard && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={onDeleteBoard}>
                Delete board
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
}

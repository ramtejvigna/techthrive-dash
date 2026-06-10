"use client";

import {
  getMilestoneProgressCounts,
  getMilestoneProgressPercent,
  type MilestoneProgressCounts,
} from "@/lib/milestone-status";
import type { Milestone } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MilestoneProgressBar({
  counts,
  className,
  showLegend = true,
}: {
  counts: MilestoneProgressCounts;
  className?: string;
  showLegend?: boolean;
}) {
  const percent = getMilestoneProgressPercent(counts);
  const total = counts.total || 1;

  return (
    <div className={cn("space-y-2", className)}>

      <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
        {counts.done > 0 && (
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(counts.done / total) * 100}%` }}
            title={`${counts.done} done`}
          />
        )}
        {counts.in_progress > 0 && (
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${(counts.in_progress / total) * 100}%` }}
            title={`${counts.in_progress} in progress`}
          />
        )}
        {counts.todo > 0 && (
          <div
            className="h-full bg-[var(--surface-subtle)] transition-all duration-500"
            style={{ width: `${(counts.todo / total) * 100}%` }}
            title={`${counts.todo} to do`}
          />
        )}
      </div>

      {showLegend && counts.total > 0 && (
        <p className="font-mono text-[10px] text-[var(--muted)]">
          {counts.todo} to do · {counts.in_progress} in progress · {counts.done} done
        </p>
      )}
    </div>
  );
}

export function MilestoneProgressFromList({
  milestones,
  className,
  showLegend = true,
}: {
  milestones: Milestone[];
  className?: string;
  showLegend?: boolean;
}) {
  const counts = getMilestoneProgressCounts(milestones);
  if (counts.total === 0) {
    return (
      <p className={cn("font-mono text-[10px] text-[var(--muted)]", className)}>
        No milestones yet
      </p>
    );
  }

  return (
    <MilestoneProgressBar counts={counts} className={className} showLegend={showLegend} />
  );
}

import type { CSSProperties } from "react";

export interface ColumnTheme {
  color: string;
  columnStyle: CSSProperties;
  headerStyle: CSSProperties;
  badgeStyle: CSSProperties;
  dotStyle: CSSProperties;
  dropRingStyle: CSSProperties;
  addBtnStyle: CSSProperties;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  cardMuted: string;
  accent: string;
}

export const PRESET_BUCKET_COLORS = [
  "#64748b",
  "#0284c7",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#0891b2",
] as const;

export function resolveColumnColor(column: { id: string; color?: string | null }): string {
  if (column.color) {
    return column.color;
  }
  let hash = 0;
  for (let i = 0; i < column.id.length; i++) {
    hash = (hash + column.id.charCodeAt(i) * (i + 1)) % PRESET_BUCKET_COLORS.length;
  }
  return PRESET_BUCKET_COLORS[hash];
}

export function getColumnTheme(column: { id: string; color?: string | null }): ColumnTheme {
  const color = resolveColumnColor(column);
  return buildColumnTheme(color);
}

function buildColumnTheme(hex: string): ColumnTheme {
  return {
    color: hex,
    columnStyle: { backgroundColor: `color-mix(in srgb, ${hex} 14%, var(--surface))` },
    headerStyle: { backgroundColor: `color-mix(in srgb, ${hex} 8%, var(--surface))` },
    badgeStyle: {
      backgroundColor: "color-mix(in srgb, var(--surface) 92%, transparent)",
      border: `1px solid color-mix(in srgb, ${hex} 22%, var(--surface))`,
      color: `color-mix(in srgb, ${hex} 72%, var(--foreground))`,
      boxShadow: "0 1px 2px var(--accent-glow)",
    },
    dotStyle: { backgroundColor: hex },
    dropRingStyle: {
      boxShadow: `0 0 0 2px color-mix(in srgb, ${hex} 35%, var(--surface))`,
    },
    addBtnStyle: {
      borderColor: `color-mix(in srgb, ${hex} 30%, var(--surface))`,
      color: `color-mix(in srgb, ${hex} 65%, var(--foreground))`,
    },
    cardBg: "bg-[var(--surface)]",
    cardBorder: "border-[var(--border)]",
    cardText: "text-[var(--foreground)]",
    cardMuted: "text-[var(--muted)]",
    accent: hex,
  };
}

/** @deprecated Use getColumnTheme(column) */
export function getColumnThemeById(columnId: string): ColumnTheme {
  return getColumnTheme({ id: columnId });
}

export const PRIORITY_STYLES = {
  low: "bg-[var(--surface-hover)] text-[var(--muted)] ring-1 ring-[var(--border)]",
  medium: "bg-[var(--surface-subtle)]/80 text-[var(--foreground)] ring-1 ring-[var(--border-strong)]/50",
  high: "bg-fuchsia-500/15 text-fuchsia-400 ring-1 ring-fuchsia-500/30",
} as const;

export function formatDueLabel(dueDate: string | null): string | null {
  if (!dueDate) return null;
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) {
    const days = Math.abs(diff);
    return `${days} Day${days === 1 ? "" : "s"} Past Due`;
  }
  if (diff === 0) return "Due Today";
  if (diff === 1) return "Due Tomorrow";
  return `Due in ${diff} Days`;
}

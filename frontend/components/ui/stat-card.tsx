"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent: "blue" | "cyan" | "emerald" | "amber";
  delay?: number;
}

const accentStyles = {
  blue: {
    icon: "bg-[var(--accent-light)] text-[var(--accent)] ring-[var(--accent)]/20",
    bar: "bg-[var(--accent)]",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600 ring-cyan-500/20",
    bar: "bg-cyan-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-500/20",
    bar: "bg-emerald-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-500/20",
    bar: "bg-amber-500",
  },
};

export function StatCard({ label, value, icon, accent, delay = 0 }: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group tech-frame overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="tech-label">{label}</p>
            <motion.p
              key={value}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 font-mono text-3xl font-bold tabular-nums tracking-tight text-[var(--foreground)]"
            >
              {String(value).padStart(2, "0")}
            </motion.p>
            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]">
              <motion.div
                className={cn("h-full rounded-full", styles.bar)}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(value * 20, 100)}%` }}
                transition={{ delay: delay + 0.3, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105",
              styles.icon,
            )}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

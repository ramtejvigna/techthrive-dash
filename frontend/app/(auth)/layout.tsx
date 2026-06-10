"use client";

import { RequireGuest } from "@/components/auth/auth-guard";
import { ThemeToggleCompact } from "@/components/theme-toggle-compact";
import { motion } from "framer-motion";

const features = [
  { code: "PRJ", label: "Project tracking", status: "active" },
  { code: "KBN", label: "Kanban boards", status: "active" },
  { code: "EML", label: "Email sync", status: "pending" },
  { code: "YT", label: "YouTube analytics", status: "pending" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireGuest>
    <div className="tech-dots relative flex min-h-full flex-1 overflow-hidden">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggleCompact />
      </div>
      {/* Left panel — tech showcase */}
      <div className="relative hidden flex-1 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="tech-frame flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-light)]">
              <span className="font-mono text-sm font-bold text-[var(--accent)]">TT</span>
            </div>
            <div>
              <span className="text-base font-semibold">TechThrive</span>
              <p className="font-mono text-[10px] tracking-widest text-[var(--muted)]">
                COMMAND CENTER
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            // initialize workspace
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Build faster.
            <br />
            <span className="gradient-text">Ship smarter.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            A unified control panel for projects, kanban workflows, and content pipelines — engineered for solo builders.
          </p>

          {/* Module status list */}
          <div className="mt-8 space-y-2">
            {features.map((f, i) => (
              <motion.div
                key={f.code}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5"
              >
                <span className="font-mono text-[10px] font-medium text-[var(--accent)]">
                  {f.code}
                </span>
                <span className="flex-1 text-sm text-[var(--foreground)]">{f.label}</span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-wider ${
                    f.status === "active" ? "text-emerald-600" : "text-[var(--muted-light)]"
                  }`}
                >
                  {f.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-[10px] text-[var(--muted-light)]"
        >
          TechThrive Hub · build 2026.06 · all systems nominal
        </motion.p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-1 items-center justify-center bg-[var(--surface)]/60 px-4 py-12 backdrop-blur-sm lg:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
    </RequireGuest>
  );
}

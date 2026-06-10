"use client";

import {
  BlogIcon,
  HomeIcon,
  KanbanIcon,
  LogoutIcon,
  MailIcon,
  ProjectsIcon,
  YoutubeIcon,
} from "@/components/icons/nav-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

const navItems: {
  href: string;
  label: string;
  code: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { href: "/dashboard", label: "Home", code: "01", icon: HomeIcon },
  { href: "/dashboard/projects", label: "Projects", code: "02", icon: ProjectsIcon },
  { href: "/dashboard/kanban", label: "Kanban", code: "03", icon: KanbanIcon },
];

const comingSoon = [
  { label: "Email", icon: MailIcon },
  { label: "YouTube", icon: YoutubeIcon },
  { label: "Blog", icon: BlogIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-dvh w-[248px] shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      <div className="border-b border-[var(--sidebar-border)] px-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="tech-frame flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-light)] ring-1 ring-[var(--accent)]/20">
            <span className="font-mono text-xs font-bold text-[var(--accent)]">TT</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-[var(--sidebar-fg)]">
              TechThrive
            </p>
            <p className="font-mono text-[10px] tracking-wider text-[var(--sidebar-muted)]">
              v1.0 · workspace
            </p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <p className="tech-label px-3 pb-2 pt-1">Modules</p>
        {navItems.map((item, index) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-fg)]"
                    : "text-[var(--sidebar-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--sidebar-fg)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="font-mono text-[10px] text-[var(--muted-light)] group-hover:text-[var(--accent)]">
                  {item.code}
                </span>
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-[var(--accent)]" : "text-[var(--muted-light)]",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          );
        })}

        <div className="pt-5">
          <p className="tech-label px-3 pb-2">Pipeline</p>
          {comingSoon.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-light)]"
              >
                <Icon className="h-4 w-4 opacity-50" />
                <span>{item.label}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-wider">
                  soon
                </span>
              </div>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto space-y-2 border-t border-[var(--sidebar-border)] p-4">
        <ThemeToggle />
        <div className="flex items-center gap-2 px-1">
          <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-600">
            System online
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 font-mono text-xs uppercase tracking-wide text-[var(--muted)]"
        >
          <LogoutIcon className="h-3.5 w-3.5" />
          Exit session
        </Button>
      </div>
    </aside>
  );
}

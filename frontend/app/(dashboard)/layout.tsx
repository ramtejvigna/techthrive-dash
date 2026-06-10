import { RequireAuth } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
    <div className="tech-canvas flex h-dvh min-h-0 overflow-hidden">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-[var(--background)]">
        {children}
      </main>
    </div>
    </RequireAuth>
  );
}

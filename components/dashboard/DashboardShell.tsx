import type { ReactNode } from "react";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import TopNav from "@/components/dashboard/TopNav";

interface DashboardShellProps {
  title: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  children: ReactNode;
}

export default function DashboardShell({ title, breadcrumbs, children }: DashboardShellProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <TopNav />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr]">{children}</div>
    </div>
  );
}

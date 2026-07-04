'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview", href: "/dashboard" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "Chat", href: "/dashboard/chat" },
  { label: "PDF Viewer", href: "/dashboard/pdf" },
  { label: "AI Summary", href: "/dashboard/summary" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname() || "/dashboard";

  return (
    <aside className="hidden w-full max-w-xs shrink-0 space-y-8 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/30 xl:block">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Workspace</p>
        <p className="mt-3 text-xl font-semibold text-white">Dashboard navigation</p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-3xl border px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

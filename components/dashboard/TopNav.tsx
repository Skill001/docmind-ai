"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import Link from "next/link";

const pages = [
  { label: "Overview", href: "/dashboard" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "Chat", href: "/dashboard/chat" },
  { label: "AI Summary", href: "/dashboard/summary" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              pathname === page.href ? "bg-blue-500 text-white" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            {page.label}
          </Link>
        ))}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((state) => !state)}
          className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 transition hover:border-blue-500"
        >
          <span>Admin</span>
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        </button>

        {dropdownOpen ? (
          <div className="absolute right-0 mt-3 w-56 rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4 shadow-xl shadow-slate-950/40">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Profile</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-3xl bg-slate-900/90 p-3">
                <p className="text-sm text-white">DocMind AI User</p>
                <p className="text-xs text-slate-500">admin@example.com</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-white">DocMind AI</p>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            Build smarter workflows with AI-powered document search, chat, and summaries.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        © 2026 DocMind AI. All Rights Reserved.
      </p>
    </footer>
  );
}

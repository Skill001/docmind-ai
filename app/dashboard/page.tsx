import Link from "next/link";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";

const metrics = [
  { label: "Documents", value: "38", detail: "Uploaded this month" },
  { label: "Chats", value: "124", detail: "Conversations started" },
  { label: "Summaries", value: "56", detail: "Generated this week" },
];

const recentDocuments = [
  { title: "Quarterly report.pdf", subtitle: "Financial analysis" },
  { title: "Product roadmap.docx", subtitle: "Strategy document" },
  { title: "Customer research.pdf", subtitle: "Insights and quotes" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading
            title="Welcome back to DocMind"
            subtitle="Manage documents, start chats, and generate AI summaries from a single dashboard."
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/upload">
            <Button variant="secondary">Upload Documents</Button>
          </Link>
          <Link href="/dashboard/chat">
            <Button>Open Chat</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metric.value}</p>
            <p className="mt-3 text-sm text-slate-400">{metric.detail}</p>
          </div>
        ))}
      </div>

      <Panel title="Recent documents" description="Your latest uploaded and analyzed files.">
        <div className="space-y-4">
          {recentDocuments.map((document) => (
            <div key={document.title} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              <p className="font-medium text-white">{document.title}</p>
              <p className="mt-1 text-sm text-slate-400">{document.subtitle}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

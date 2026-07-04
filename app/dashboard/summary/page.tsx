import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";

const summaries = [
  { title: "Market research summary", excerpt: "A concise overview of market drivers, competitor positioning, and strategic opportunities." },
  { title: "Board presentation summary", excerpt: "Key financial headlines, customer insights, and execution plan highlights for leadership review." },
];

export default function SummaryPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="AI summary"
        subtitle="Generate concise summaries from your documents so you can quickly review the most important points."
      />

      <Panel title="Summary generator" description="Choose a document and produce a short AI-powered summary instantly." className="space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Selected document</p>
              <p className="mt-2 text-lg font-semibold text-white">Market strategy 2026.pdf</p>
            </div>
            <Button>Generate summary</Button>
          </div>
        </div>
      </Panel>

      <Panel title="Recent summaries" description="Review summaries generated from your latest documents.">
        <div className="space-y-4">
          {summaries.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-white">{item.title}</p>
                <Button variant="secondary">View</Button>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.excerpt}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

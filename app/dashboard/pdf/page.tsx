import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";

export default function PdfPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="PDF viewer"
        subtitle="Preview uploaded PDF documents and navigate them inside your dashboard."
      />

      <Panel title="Preview document" description="View the selected PDF directly in the workspace." className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/90">
          <div className="bg-slate-900/90 px-6 py-5 text-sm text-slate-300">Sales_Plan_2026.pdf</div>
          <div className="min-h-[640px] bg-slate-950 p-6">
            <div className="h-full rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-8 text-slate-400">
              <p className="text-lg font-semibold text-white">PDF Viewer Placeholder</p>
              <p className="mt-4 text-sm leading-7">The embedded PDF viewer will display pages here with zoom, navigation, and content search controls.</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

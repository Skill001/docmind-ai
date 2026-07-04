import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import TextInput from "@/components/ui/TextInput";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="Settings"
        subtitle="Update your workspace preferences and account details for DocMind AI." 
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Account</p>
          <div className="mt-6 space-y-5">
            <TextInput label="Name" type="text" placeholder="Your name" />
            <TextInput label="Email" type="email" placeholder="you@example.com" />
            <TextInput label="Company" type="text" placeholder="Company name" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Workspace preferences</p>
          <div className="mt-6 space-y-5">
            <TextInput label="Default document view" type="text" placeholder="PDF viewer" />
            <TextInput label="Summary length" type="text" placeholder="Short / Medium / Long" />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button className="w-full">Save changes</Button>
              <Button variant="secondary" className="w-full">Reset</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

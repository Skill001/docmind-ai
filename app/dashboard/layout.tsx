import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10 xl:px-8">
          <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
            <Sidebar />

            <div className="space-y-8">
              <TopNav />
              <main className="space-y-8">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

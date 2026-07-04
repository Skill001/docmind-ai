import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-20 pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 opacity-70 blur-3xl" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex rounded-full border border-blue-500 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-200">
            AI document assistant for teams and knowledge workers
          </span>

          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Chat with documents, summarize files, and keep answers at your fingertips.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Upload PDFs, Word docs, and text files to ask questions, generate summaries, and unlock the knowledge inside your documents.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/upload" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              Upload Documents
            </Link>
            <Link href="/dashboard/chat" className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-500 hover:text-white">
              Open Chat
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 sm:p-10">
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">AI highlight</p>
              <p className="mt-4 text-2xl font-semibold text-white">“DocMind made our research searchable and helped us answer questions in seconds.”</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-sm text-slate-400">Files processed</p>
                <p className="mt-3 text-3xl font-semibold text-white">182</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-sm text-slate-400">Average answer time</p>
                <p className="mt-3 text-3xl font-semibold text-white">0.8s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

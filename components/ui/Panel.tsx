interface PanelProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Panel({ title, description, className = "", children }: PanelProps) {
  return (
    <section className={`rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/10 ${className}`}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">{title}</p>
        {description ? <p className="mt-3 text-base text-slate-300">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

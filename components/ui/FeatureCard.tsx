interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 transition hover:border-blue-500/80 hover:bg-slate-900">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-500/10 text-2xl">{icon}</div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}

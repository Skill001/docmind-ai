interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({ title, subtitle, center }: SectionHeadingProps) {
  return (
    <div className={`space-y-4 ${center ? "text-center" : ""}`}>
      <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      {subtitle ? <p className="max-w-3xl text-lg leading-8 text-slate-300">{subtitle}</p> : null}
    </div>
  );
}

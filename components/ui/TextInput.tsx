interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export default function TextInput({
  label,
  description,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 block font-medium text-slate-100">{label}</span>
      <input
        className={`w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
        {...props}
      />
      {description ? <span className="mt-2 block text-xs text-slate-500">{description}</span> : null}
    </label>
  );
}

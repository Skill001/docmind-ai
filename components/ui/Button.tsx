type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-400",
  secondary: "border border-slate-700 bg-slate-900 text-slate-100 hover:border-blue-500 hover:text-white",
  ghost: "text-slate-200 hover:text-white",
};

export default function Button({
  type = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

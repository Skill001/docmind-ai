type DocumentStatus = "Completed" | "Processing" | "Pending" | "Failed";

const statusStyles: Record<DocumentStatus, string> = {
  Completed: "bg-emerald-500/10 text-emerald-300",
  Processing: "bg-blue-500/10 text-blue-300",
  Pending: "bg-slate-700 text-slate-200",
  Failed: "bg-rose-500/10 text-rose-300",
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

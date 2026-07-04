import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

interface DocumentFilterBarProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  sortKey: string;
  sortDirection: "asc" | "desc";
  pageSize: number;
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortKeyChange: (value: string) => void;
  onToggleSortDirection: () => void;
  onPageSizeChange: (value: number) => void;
}

const statusOptions = ["All", "Completed", "Processing", "Pending", "Failed"];
const typeOptions = ["All", "PDF", "DOC", "DOCX", "TXT"];
const sortOptions = [
  { value: "name", label: "Name" },
  { value: "date", label: "Upload date" },
  { value: "size", label: "Size" },
];

export default function DocumentFilterBar({
  searchQuery,
  statusFilter,
  typeFilter,
  sortKey,
  sortDirection,
  pageSize,
  onSearch,
  onStatusChange,
  onTypeChange,
  onSortKeyChange,
  onToggleSortDirection,
  onPageSizeChange,
}: DocumentFilterBarProps) {
  return (
    <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-5 shadow-sm shadow-slate-950/10 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_auto]">
        <TextInput
          label="Search documents"
          placeholder="Search by name, type, or status"
          value={searchQuery}
          onChange={(event) => onSearch(event.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-200">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Type</span>
            <select
              value={typeFilter}
              onChange={(event) => onTypeChange(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] items-end">
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Sort by</span>
          <select
            value={sortKey}
            onChange={(event) => onSortKeyChange(event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button variant="secondary" type="button" className="w-full" onClick={onToggleSortDirection}>
          {sortDirection === "asc" ? "Ascending" : "Descending"}
        </Button>

        <label className="block text-sm text-slate-200">
          <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Page size</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {[5, 8, 12].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

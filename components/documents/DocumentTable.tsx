import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import type { DocumentItem } from "@/lib/documents";

interface DocumentTableProps {
  documents: DocumentItem[];
  editingId: string | null;
  draftName: string;
  onStartEdit: (document: DocumentItem) => void;
  onCancelEdit: () => void;
  onChangeDraft: (value: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string, path: string) => void;
  onDownload: (id: string) => void;
}

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentTable({
  documents,
  editingId,
  draftName,
  onStartEdit,
  onCancelEdit,
  onChangeDraft,
  onSave,
  onDelete,
  onDownload,
}: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/90 shadow-xl shadow-slate-950/20">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-900/90 text-slate-400">
          <tr>
            <th className="px-6 py-4 text-sm font-medium uppercase tracking-[0.24em]">Name</th>
            <th className="px-6 py-4 text-sm font-medium uppercase tracking-[0.24em]">Uploaded</th>
            <th className="px-6 py-4 text-sm font-medium uppercase tracking-[0.24em]">Size</th>
            <th className="px-6 py-4 text-sm font-medium uppercase tracking-[0.24em]">Status</th>
            <th className="px-6 py-4 text-sm font-medium uppercase tracking-[0.24em]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => {
            const editing = editingId === document.id;

            return (
              <tr key={document.id} className="border-t border-slate-800 last:border-b last:border-slate-800">
                <td className="px-6 py-5 align-top">
                  {editing ? (
                    <TextInput
                      label="Rename document"
                      value={draftName}
                      onChange={(event) => onChangeDraft(event.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <div>
                      <p className="font-semibold text-white">{document.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{document.type}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 align-top text-sm text-slate-300">{formatDate(document.uploadedAt)}</td>
                <td className="px-6 py-5 align-top text-sm text-slate-300">{formatBytes(document.size)}</td>
                <td className="px-6 py-5 align-top">
                  <DocumentStatusBadge status={document.status} />
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    {editing ? (
                      <>
                        <Button variant="secondary" type="button" className="px-4 py-2" onClick={() => onSave(document.id)}>
                          Save
                        </Button>
                        <Button variant="ghost" type="button" className="px-4 py-2 text-slate-300" onClick={onCancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" type="button" className="px-4 py-2" onClick={() => onStartEdit(document)}>
                          Rename
                        </Button>
                        <Button variant="secondary" type="button" className="px-4 py-2" onClick={() => onDownload(document.id)}>
                          Download
                        </Button>
                        <Button variant="ghost" type="button" className="px-4 py-2 text-rose-300 hover:text-white" onClick={() => onDelete(document.id, document.path)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

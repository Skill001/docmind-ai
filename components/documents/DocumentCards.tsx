import Button from "@/components/ui/Button";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import TextInput from "@/components/ui/TextInput";
import type { DocumentItem } from "@/lib/documents";

interface DocumentCardsProps {
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

export default function DocumentCards({
  documents,
  editingId,
  draftName,
  onStartEdit,
  onCancelEdit,
  onChangeDraft,
  onSave,
  onDelete,
  onDownload,
}: DocumentCardsProps) {
  return (
    <div className="space-y-4">
      {documents.map((document) => {
        const editing = editingId === document.id;

        return (
          <div key={document.id} className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{document.type}</p>
                {editing ? (
                  <TextInput
                    label="Rename document"
                    value={draftName}
                    onChange={(event) => onChangeDraft(event.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <h3 className="mt-3 text-lg font-semibold text-white">{document.name}</h3>
                )}
              </div>
              <DocumentStatusBadge status={document.status} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Uploaded</p>
                <p className="mt-2 text-sm text-slate-300">{formatDate(document.uploadedAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Size</p>
                <p className="mt-2 text-sm text-slate-300">{formatBytes(document.size)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                <p className="mt-2 text-sm text-slate-300">{document.status}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {editing ? (
                <>
                  <Button variant="secondary" type="button" onClick={() => onSave(document.id)}>
                    Save name
                  </Button>
                  <Button variant="ghost" type="button" className="text-slate-300" onClick={onCancelEdit}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" type="button" onClick={() => onStartEdit(document)}>
                    Rename
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => onDownload(document.id)}>
                    Download
                  </Button>
                  <Button variant="ghost" type="button" className="text-rose-300" onClick={() => onDelete(document.id, document.path)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

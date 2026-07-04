"use client";

import { useEffect, useState } from "react";
import UploadDropzone from "@/components/upload/UploadDropzone";
import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";
import { DocumentItem, fetchUserDocuments } from "@/lib/documents";

export default function UploadPage() {
  const [recentDocuments, setRecentDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshDocuments = async () => {
    try {
      const documents = await fetchUserDocuments();
      setRecentDocuments(documents.slice(0, 4));
      setError(null);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Unable to load documents.";
      setError(message);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleUploadComplete = async () => {
    await refreshDocuments();
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Upload your documents"
        subtitle="Upload files and save document metadata in your workspace automatically. Local storage is used in development."
      />

      <UploadDropzone onUploadComplete={handleUploadComplete} />

      <Panel title="Recently uploaded" description="Your latest uploads will appear here after a successful upload.">
        {error ? (
          <p className="rounded-3xl border border-rose-700 bg-rose-950/80 p-5 text-sm text-rose-200">{error}</p>
        ) : recentDocuments.length === 0 ? (
          <p className="text-sm text-slate-400">No recent uploads yet. Upload a PDF to see it listed here.</p>
        ) : (
          <div className="space-y-4">
            {recentDocuments.map((document) => (
              <div key={document.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-950/90 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{document.type}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{document.name}</p>
                </div>
                <div className="text-sm text-slate-400">
                  <p>{new Date(document.uploadedAt).toLocaleDateString()}</p>
                  <p className="mt-1">{(document.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

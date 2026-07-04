"use client";

import { DragEvent, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { uploadDocuments, DocumentItem } from "@/lib/documents";

interface UploadDropzoneProps {
  onUploadComplete: (documents: DocumentItem[]) => void;
}

const MAX_FILE_SIZE_MB = 100;
const MAX_FILES = 10;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

function formatFileSize(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function getFileExtension(filename: string) {
  const found = filename.match(/\.([^.]+)$/);
  return found ? found[1].toLowerCase() : "";
}

function isSupportedFile(file: File) {
  const extension = getFileExtension(file.name);
  return (
    ALLOWED_FILE_TYPES.includes(file.type) ||
    ["pdf", "doc", "docx", "txt"].includes(extension)
  );
}

export default function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleUpload = async (files: File[]) => {
    setSelectedFiles(files);
    setStatus("uploading");
    setProgress(0);
    setMessage(`Uploading ${files.length} document${files.length === 1 ? "" : "s"}...`);

    try {
      const uploadedDocuments = await uploadDocuments(files, setProgress);
      setStatus("success");
      setMessage("Upload complete. Documents saved to your workspace.");
      onUploadComplete(uploadedDocuments);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  const validateFile = (file: File) => {
    if (!isSupportedFile(file)) {
      throw new Error("Only PDF, DOC, DOCX, and TXT files are allowed.");
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      try {
        files.forEach(validateFile);
        handleUpload(files);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to upload files.";
        setStatus("error");
        setMessage(errorMessage);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) {
      try {
        files.forEach(validateFile);
        handleUpload(files);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to upload files.";
        setStatus("error");
        setMessage(errorMessage);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
      <div
        className={`group rounded-[2rem] border-2 border-dashed px-6 py-12 text-center transition ${
          dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/80"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Upload documents</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">Drag & drop your files here</h2>
        <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-400">
          Select up to {MAX_FILES} files under {MAX_FILE_SIZE_MB}MB each. Documents are stored locally in development and in MinIO in production.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="secondary" type="button" onClick={openFileDialog}>
            Choose files
          </Button>
          <span className="text-sm text-slate-400">or drop them anywhere in this card</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          onChange={handleInputChange}
          multiple
        />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-400">
        <p>Accepted file types: PDF, DOC, DOCX, TXT</p>
        <p>Max file size: {MAX_FILE_SIZE_MB} MB per file</p>
        <p>Upload up to 10 files at once.</p>
      </div>

      {status !== "idle" ? (
        <div className="space-y-3 rounded-[1.5rem] bg-slate-900/90 p-5 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{status === "success" ? "Upload succeeded" : status === "error" ? "Upload error" : "Uploading"}</p>
              <p className="mt-1 text-sm text-slate-400">{message}</p>
            </div>
            {selectedFiles.length > 0 ? (
              <p className="text-sm text-slate-400">
                {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} selected
              </p>
            ) : null}
          </div>

          <div className="rounded-full bg-slate-800 h-3 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

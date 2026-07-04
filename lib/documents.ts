export interface DocumentItem {
  id: string;
  name: string;
  originalName?: string;
  uploadedAt: string;
  size: number;
  fileHash?: string;
  fileExtension?: string;
  mimeType?: string;
  pages?: number | null;
  language?: string | null;
  processingStatus?: string;
  aiReady?: boolean;
  thumbnailUrl?: string | null;
  favorite?: boolean;
  lastOpenedAt?: string | null;
  status: "Completed" | "Processing" | "Pending" | "Failed";
  type: "PDF" | "DOCX" | "DOC" | "TXT" | "OTHER";
  path: string;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "txt"];

function getDocumentType(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "application/msword") return "DOC";
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "DOCX";
  if (mimeType === "text/plain") return "TXT";
  return "OTHER";
}

function normalizeStatus(status: string) {
  if (status === "uploaded") return "Completed";
  if (status === "failed") return "Failed";
  if (status === "processing") return "Processing";
  if (status === "pending") return "Pending";
  return status as "Completed" | "Processing" | "Pending" | "Failed";
}

function getFileExtension(name: string): string {
  const match = name.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

function mapDocumentRecord(record: any): DocumentItem {
  return {
    id: record.id,
    name: record.name,
    originalName: record.original_name ?? record.originalName,
    uploadedAt: record.uploaded_at ?? record.uploadedAt,
    size: Number(record.file_size ?? record.size),
    fileHash: record.file_hash ?? null,
    fileExtension: record.file_extension ?? getFileExtension(record.name),
    mimeType: record.mime_type ?? null,
    pages: record.pages ?? null,
    language: record.language ?? null,
    processingStatus: record.processing_status ?? null,
    aiReady: record.ai_ready ?? false,
    thumbnailUrl: record.thumbnail_url ?? null,
    favorite: record.favorite ?? false,
    lastOpenedAt: record.last_opened_at ?? null,
    status: normalizeStatus(record.status),
    type: getDocumentType(record.mime_type ?? record.type ?? ""),
    path: record.storage_path ?? record.path,
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(response.statusText || "Unable to parse server response.");
  }
}

export async function fetchUserDocuments(): Promise<DocumentItem[]> {
  const response = await fetch("/api/documents", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to load documents.");
  }

  const payload = await parseJsonResponse<{ documents: any[] }>(response);
  return payload.documents.map(mapDocumentRecord);
}

export async function uploadDocuments(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<DocumentItem[]> {
  if (files.length === 0) {
    throw new Error("No documents selected for upload.");
  }

  if (files.length > MAX_FILES) {
    throw new Error(`You can upload up to ${MAX_FILES} files at once.`);
  }

  const invalidFile = files.find((file) => {
    const extension = getFileExtension(file.name);
    const hasMime = ALLOWED_MIME_TYPES.includes(file.type);
    const hasExt = ALLOWED_EXTENSIONS.includes(extension);
    return !(hasMime || hasExt);
  });

  if (invalidFile) {
    throw new Error("Unsupported file type. Upload PDF, DOC, DOCX, or TXT files.");
  }

  const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
  if (oversizedFile) {
    throw new Error(`Each file must be smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("documents", file));

  return new Promise<DocumentItem[]>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/documents");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = async () => {
      const responseText = xhr.responseText || "";
      if (xhr.status === 201) {
        try {
          const payload = JSON.parse(responseText) as { documents: any[] };
          const documents = payload.documents.map(mapDocumentRecord);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("documents-updated", Date.now().toString());
          }
          resolve(documents);
        } catch (error) {
          reject(new Error("Unable to parse upload response."));
        }
        return;
      }

      try {
        const payload = JSON.parse(responseText) as { error?: string };
        reject(new Error(payload.error || "Upload failed."));
      } catch {
        reject(new Error(xhr.statusText || "Upload failed."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed. Please check your connection and try again."));
    };

    xhr.send(formData);
  });
}

export async function renameDocument(id: string, name: string): Promise<DocumentItem> {
  if (!name.trim()) {
    throw new Error("Document name cannot be empty.");
  }

  const response = await fetch(`/api/documents/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to rename document.");
  }

  const payload = await parseJsonResponse<{ document: any }>(response);
  return mapDocumentRecord(payload.document);
}

export async function deleteDocument(documentId: string, path: string): Promise<void> {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to delete document.");
  }
}

export async function downloadDocument(id: string): Promise<string> {
  const response = await fetch(`/api/documents/${id}/download`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to download document.");
  }

  const payload = await parseJsonResponse<{ url: string }>(response);
  return payload.url;
}

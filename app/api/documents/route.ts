import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionToken, verifyJwt } from "@/lib/authServer";
import { deleteFile, uploadFile } from "@/lib/storage";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_FILE_EXTENSIONS = ["pdf", "doc", "docx", "txt"];

class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function getDocumentType(mimeType: string, extension: string) {
  if (mimeType === "application/pdf" || extension === "pdf") return "PDF";
  if (mimeType === "application/msword" || extension === "doc") return "DOC";
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  )
    return "DOCX";
  if (mimeType === "text/plain" || extension === "txt") return "TXT";
  return "OTHER";
}

function getFileExtension(filename: string) {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

function normalizeStatus(status: string) {
  if (status === "uploaded") return "Completed";
  if (status === "failed") return "Failed";
  if (status === "processing") return "Processing";
  if (status === "pending") return "Pending";
  return status as string;
}

function mapDocumentRecord(record: any) {
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

export async function GET(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyJwt(token);

    const result = await query(
      `SELECT id, name, original_name, stored_name, file_type, file_size, mime_type, storage_path, status, uploaded_at
       FROM documents
       WHERE user_id = $1
       ORDER BY uploaded_at DESC`,
      [session.sub]
    );

    const documents = result.rows.map(mapDocumentRecord);
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Document list API error", error);
    return NextResponse.json({ error: "Unable to load documents." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyJwt(token);
    const formData = await request.formData();
    const fileEntries = formData.getAll("documents");

    if (fileEntries.length === 0) {
      return NextResponse.json({ error: "No documents provided." }, { status: 400 });
    }

    if (fileEntries.length > MAX_FILES) {
      return NextResponse.json({ error: `Upload limit is ${MAX_FILES} files at once.` }, { status: 400 });
    }

    const files = fileEntries.map((entry) => {
      if (!(entry instanceof File)) {
        throw new ApiError("Invalid file upload.");
      }
      return entry as File;
    });

    const validatedFiles = files.map((file) => {
      const mimeType = file.type || "application/octet-stream";
      const extension = getFileExtension(file.name);
      const isMimeAllowed = ALLOWED_MIME_TYPES.includes(mimeType);
      const isExtensionAllowed = ALLOWED_FILE_EXTENSIONS.includes(extension);

      if (!isExtensionAllowed || (!isMimeAllowed && mimeType !== "application/octet-stream")) {
        throw new ApiError("Unsupported file type. Upload PDF, DOC, DOCX, or TXT files only.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new ApiError(`Each file must be smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      }

      return { file, mimeType, extension, fileType: getDocumentType(mimeType, extension) };
    });

    const uploadedDocuments = [];
    const uploadedStoragePaths: string[] = [];

    try {
      for (const { file, mimeType, extension, fileType } of validatedFiles) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
        const storedName = `${timestamp}_${Math.random().toString(36).slice(2)}_${safeName}`;
        const storagePath = `uploads/${session.sub}/${storedName}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileHash = createHash("sha256").update(fileBuffer).digest("hex");

        await uploadFile(storagePath, fileBuffer, mimeType);
        uploadedStoragePaths.push(storagePath);

        const result = await query(
          `INSERT INTO documents (
             user_id,
             name,
             original_name,
             stored_name,
             file_type,
             file_size,
             mime_type,
             storage_path,
             status
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, name, original_name, file_size, mime_type, storage_path, status, uploaded_at`,
          [
            session.sub,
            file.name,
            file.name,
            storedName,
            fileType,
            file.size,
            mimeType,
            storagePath,
            "uploaded",
          ]
        );

        uploadedDocuments.push(mapDocumentRecord(result.rows[0]));
      }
    } catch (uploadError) {
      console.error("Partial upload cleanup", uploadError);
      for (const path of uploadedStoragePaths) {
        try {
          await deleteFile(path);
        } catch (cleanupError) {
          console.error("Failed to clean up uploaded file", path, cleanupError);
        }
      }
      return NextResponse.json({ error: (uploadError as Error).message || "Unable to upload documents." }, { status: 500 });
    }

    return NextResponse.json({ documents: uploadedDocuments }, { status: 201 });
  } catch (error) {
    console.error("Document upload API error", error);
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unable to upload documents." }, { status: 500 });
  }
}

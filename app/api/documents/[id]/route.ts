import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionToken, verifyJwt } from "@/lib/authServer";
import { deleteFile } from "@/lib/storage";

function normalizeDocument(record: any) {
  return {
    id: record.id,
    name: record.name,
    uploadedAt: record.uploaded_at ?? record.uploadedAt,
    size: Number(record.file_size ?? record.size),
    status: record.status === "uploaded" ? "Completed" : record.status,
    type: record.mime_type === "application/pdf" ? "PDF" : record.mime_type === "text/plain" ? "TXT" : "DOCX",
    path: record.storage_path ?? record.path,
  };
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = getSessionToken(request);
    console.log("PATCH /api/documents/[id] jwt token present", !!token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyJwt(token);
    console.log("PATCH /api/documents/[id] session sub", session.sub);
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Document name cannot be empty." }, { status: 400 });
    }

    const params = await context.params;
    const id = params.id;
    console.log("PATCH /api/documents/[id] requested id", id);
    const result = await query(
      `UPDATE documents SET name = $1, updated_at = now() WHERE id = $2 AND user_id = $3 RETURNING id, name, file_size, mime_type, storage_path, status, uploaded_at`,
      [name, id, session.sub]
    );
    console.log("PATCH /api/documents/[id] query", `UPDATE documents ...`, [name, id, session.sub]);
    console.log("PATCH /api/documents/[id] rowCount", result.rowCount);

    if (result.rowCount === 0) {
      console.log("PATCH /api/documents/[id] not found for user", session.sub);
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    console.log("PATCH /api/documents/[id] updated row", result.rows[0]);
    return NextResponse.json({ document: normalizeDocument(result.rows[0]) }, { status: 200 });
  } catch (error) {
    console.error("Document rename API error", error);
    return NextResponse.json({ error: "Unable to rename document." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const token = getSessionToken(request);
    console.log("DELETE /api/documents/[id] jwt token present", !!token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyJwt(token);
    console.log("DELETE /api/documents/[id] session sub", session.sub);
    const params = await context.params;
    const id = params.id;
    console.log("DELETE /api/documents/[id] requested id", id);
    const result = await query(
      `SELECT storage_path FROM documents WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [id, session.sub]
    );
    console.log("DELETE /api/documents/[id] query", `SELECT storage_path ...`, [id, session.sub]);
    console.log("DELETE /api/documents/[id] rowCount", result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const storagePath = result.rows[0].storage_path;
    await deleteFile(storagePath);
    await query(`DELETE FROM documents WHERE id = $1 AND user_id = $2`, [id, session.sub]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Document delete API error", error);
    return NextResponse.json({ error: "Unable to delete document." }, { status: 500 });
  }
}

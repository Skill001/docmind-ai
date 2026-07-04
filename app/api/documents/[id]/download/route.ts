import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionToken, verifyJwt } from "@/lib/authServer";
import { getDownloadUrl } from "@/lib/storage";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = getSessionToken(request);
    console.log("GET /api/documents/[id]/download jwt token present", !!token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyJwt(token);
    console.log("GET /api/documents/[id]/download session sub", session.sub);
    const params = await context.params;
    const id = params.id;
    console.log("GET /api/documents/[id]/download requested id", id);
    const result = await query(
      `SELECT storage_path FROM documents WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [id, session.sub]
    );
    console.log("GET /api/documents/[id]/download query", `SELECT storage_path ...`, [id, session.sub]);
    console.log("GET /api/documents/[id]/download rowCount", result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const url = await getDownloadUrl(result.rows[0].storage_path, 60);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Document download API error", error);
    return NextResponse.json({ error: "Unable to generate download link." }, { status: 500 });
  }
}

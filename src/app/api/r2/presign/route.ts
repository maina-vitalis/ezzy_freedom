import { auth } from "@/lib/auth";
import { buildObjectKey, getPublicObjectUrl, getSignedUploadUrl } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const ALLOWED_FOLDERS = new Set([
  "books/pdfs",
  "books/covers",
  "articles/pdfs",
  "articles/covers",
  "services/images",
]);

/**
 * POST /api/r2/presign
 * Body: { filename, contentType, folder, public?: boolean }
 * Returns a short-lived PUT URL and the object key (plus publicUrl when requested).
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const filename = String(body.filename || "");
    const contentType = String(body.contentType || "");
    const folder = String(body.folder || "");
    const wantsPublic = Boolean(body.public);

    if (!filename || !contentType || !folder) {
      return NextResponse.json(
        { error: "filename, contentType, and folder are required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const key = buildObjectKey(folder, filename);
    const uploadUrl = await getSignedUploadUrl(key, contentType);

    return NextResponse.json({
      uploadUrl,
      key,
      ...(wantsPublic ? { publicUrl: getPublicObjectUrl(key) } : {}),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create upload URL";
    console.error("R2 presign error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


/**
 * GET /api/media/[id]/content
 *
 * Secure file delivery endpoint — used for both download and in-browser viewing.
 *
 * Access is granted when the authenticated user is:
 *   (a) the file owner  (media.owner_id === user.id), OR
 *   (b) listed in shared_media with shared_with === user.id AND
 *       (expires_at IS NULL OR expires_at > now())
 *
 * Query params:
 *   ?inline=1   →  Content-Disposition: inline  (browser renders it)
 *   (default)   →  Content-Disposition: attachment  (browser downloads it)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decryptFile, fileToBuffer } from "@/lib/encryption";
import { Media } from "@/types/media";

const BUCKET = "protected-media";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  try {

    //  1. Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inline = request.nextUrl.searchParams.get("inline") === "1";

    //  2. Fetch media row (no owner filter yet — we check access below)
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single<Media>();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    //  3. Access control ─
    const isOwner = media.owner_id === user.id;

    if (!isOwner) {
      // Check shared_media table
      const { data: share, error: shareError } = await supabase
        .from("shared_media")
        .select("id, permission, expires_at")
        .eq("media_id", id)
        .eq("shared_with", user.id)
        .maybeSingle();

      if (shareError || !share) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Respect expiry
      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "Your access to this file has expired" },
          { status: 403 },
        );
      }

      // If download (not inline) check download permission
      if (!inline && share.permission !== "download") {
        return NextResponse.json(
          { error: "You do not have download permission for this file" },
          { status: 403 },
        );
      }
    }

    //  4. Fetch blob from storage
    const { data: blob, error: storageError } = await supabase.storage
      .from(BUCKET)
      .download(media.storage_path);

    console.log(storageError);
    if (storageError || !blob) {
      return NextResponse.json(
        { error: `Storage error: ${storageError?.message}` },
        { status: 500 },
      );
    }

    console.log(media);

    //  5. Decrypt if needed
    let fileBuffer: Buffer;

    if (media.is_encrypted) {
      if (!media.encrypted_key || !media.iv) {
        return NextResponse.json(
          { error: "Encryption metadata missing" },
          { status: 500 },
        );
      }
      try {
        const encryptedBuffer = await fileToBuffer(blob);
        fileBuffer = decryptFile(
          encryptedBuffer,
          media.encrypted_key,
          media.iv,
        );
      } catch (err) {
        console.error("[content] Decryption failed:", err);
        return NextResponse.json(
          { error: "Failed to decrypt file" },
          { status: 500 },
        );
      }
    } else {
      fileBuffer = await fileToBuffer(blob);
    }

    //  6. Build response ─
    const contentType = media.mime_type || "application/octet-stream";
    const safeFileName = encodeURIComponent(media.file_name).replace(
      /['()]/g,
      encodeURIComponent,
    );
    const disposition = inline
      ? `inline; filename="${media.file_name}"`
      : `attachment; filename="${media.file_name}"; filename*=UTF-8''${safeFileName}`;

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Content-Length": String(fileBuffer.byteLength),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[/api/media/[id]/content]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



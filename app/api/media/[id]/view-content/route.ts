
/**
 * GET /api/media/[id]/view-content
 *
 * Returns media metadata as JSON so the client can render the file.
 * The actual binary is served by /api/media/[id]/content?inline=1
 *
 * Access: owner OR shared_with user (view OR download permission).
 * Expired shares are rejected.
 *
 * Response shape:
 * {
 *   media: Media,
 *   contentUrl: string,   // /api/media/[id]/content?inline=1
 *   permission: "owner" | "view" | "download"
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Media } from "@/types/media";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  try {

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ── 2. Fetch media row ────────────────────────────────────────────────────
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single<Media>();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // ── 3. Access control ─────────────────────────────────────────────────────
    let permission: "owner" | "view" | "download" = "owner";
    const isOwner = media.owner_id === user.id;

    if (!isOwner) {
      const { data: share, error: shareError } = await supabase
        .from("shared_media")
        .select("permission, expires_at")
        .eq("media_id", id)
        .eq("shared_with", user.id)
        .maybeSingle();

      if (shareError || !share) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "Your access to this file has expired" },
          { status: 403 },
        );
      }

      permission = share.permission as "view" | "download";
    }

    // Strip sensitive encryption fields before sending to client
    const { encrypted_key, iv, ...safeMedia } = media;
    void encrypted_key;
    void iv;

    return NextResponse.json({
      media: safeMedia,
      contentUrl: `/api/media/${id}/content?inline=1`,
      permission,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[/api/media/[id]/view-content]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



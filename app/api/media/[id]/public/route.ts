import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { Media } from "@/types/media";

const PUBLIC_META_LIMIT = 60;
const PUBLIC_META_WINDOW_MS = 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ip = getClientIp(request);
    const limitResult = rateLimit(
      `public-meta:${ip}`,
      PUBLIC_META_LIMIT,
      PUBLIC_META_WINDOW_MS,
    );
    if (!limitResult.allowed) {
      return rateLimitResponse(limitResult);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { id } = await params;

    // Fetch media row (no auth check — public route, service role bypasses RLS)
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single<Media>();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // The only gate that matters: did the owner explicitly make this public?
    if (!media.is_public) {
      return NextResponse.json(
        { error: "This file is not publicly accessible" },
        { status: 404 },
      );
    }

    // Strip everything an anonymous visitor should never see:
    // encryption material and the raw internal storage path.
    const { encrypted_key, iv, storage_path, owner_id, ...rest } = media;
    void encrypted_key;
    void iv;
    void storage_path;

    return NextResponse.json({
      media: {
        ...rest,
        // Keep owner_id if your UI wants to show "shared by", otherwise drop it too.
        owner_id,
      },
      contentUrl: `/api/media/${id}/public/content`,
      permission: "view",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[/api/media/[id]/public]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

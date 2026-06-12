import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Media } from "@/types/media";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { id } = await params;

    // Fetch media row (no auth check — public route)
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single<Media>();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const isPublic = media.is_encrypted;
    console.log("isPublic", isPublic);

    if (isPublic) {
      return NextResponse.json(
        { error: "This file is not publicly accessible" },
        { status: 404 },
      );
    }

    // Strip sensitive fields
    const { encrypted_key, iv, ...safeMedia } = media;
    void encrypted_key;
    void iv;

    return NextResponse.json({
      media: safeMedia,
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

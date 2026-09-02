
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { ShareMediaPayload } from "@/types/media";

// Creates a new row in shared_media for a given media id.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: mediaId } = await params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify caller owns this media
  const { data: media, error: fetchError } = await supabase
    .from("media")
    .select("id, owner_id")
    .eq("id", mediaId)
    .single();

  if (fetchError || !media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  if (media.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: ShareMediaPayload = await req.json();

  // Guard: cannot share with yourself
  if (body.shared_with === user.id) {
    return NextResponse.json(
      { error: "Cannot share media with yourself" },
      { status: 400 },
    );
  }

  const { data: share, error: insertError } = await supabase
    .from("shared_media")
    .insert({
      media_id: mediaId,
      owner_id: user.id,
      shared_with: body.shared_with,
      permission: body.permission,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 },
    );
  }

  return NextResponse.json({ share }, { status: 201 });
}


import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { UpdateMediaPayload } from "@/types/media";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership before deletion
  const { data: media, error: fetchError } = await supabase
    .from("media")
    .select("id, owner_id, storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  if (media.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Remove file from storage
  //   const { error: storageError } = await supabase.storage
  //     .from("media")
  //     .remove([media.storage_path]);

  //   if (storageError) {
  //     return NextResponse.json(
  //       { error: "Failed to remove file from storage" },
  //       { status: 500 },
  //     );
  //   }

  // Delete the media row (shared_media rows cascade via FK in Supabase)
  const { error: deleteError } = await supabase
    .from("media")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json(
      { error: "Failed to delete media record" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Media deleted successfully" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from("media")
    .select("id, owner_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  if (existing.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: UpdateMediaPayload = await req.json();

  // Build the update object — only include fields that were sent
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.file_name !== undefined) updates.file_name = body.file_name;
  if (body.is_encrypted !== undefined) updates.is_encrypted = body.is_encrypted;
  if (body.is_watermarked !== undefined)
    updates.is_watermarked = body.is_watermarked;
  if (body.watermark_text !== undefined)
    updates.watermark_text = body.watermark_text;
  // Public-link toggle — owner-only, enforced by the ownership check above.
  // made_public_at is kept in sync automatically by a DB trigger, don't set it here.
  if (body.is_public !== undefined) updates.is_public = body.is_public;

  const { data: media, error: updateError } = await supabase
    .from("media")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 },
    );
  }

  return NextResponse.json({ media });
}

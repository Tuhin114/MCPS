
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { UpdateSharePermissionPayload } from "@/types/media";

// ── Shared helper: fetch row + verify caller is the owner ─────────────────────

async function getShareRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  shareId: string,
  userId: string,
) {
  const { data: share, error } = await supabase
    .from("shared_media")
    .select("id, owner_id")
    .eq("id", shareId)
    .single();

  if (error || !share) return { share: null, err: "Share not found" };
  if (share.owner_id !== userId) return { share: null, err: "Forbidden" };
  return { share, err: null };
}

// ── PATCH /api/media/share/[shareId] ─────────────────────────────────────────
// Update permission (and optionally expires_at) on an existing shared_media row.

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { share, err } = await getShareRow(supabase, shareId, user.id);

  if (err === "Share not found") {
    return NextResponse.json({ error: err }, { status: 404 });
  }
  if (err === "Forbidden") {
    return NextResponse.json({ error: err }, { status: 403 });
  }

  const body: UpdateSharePermissionPayload = await req.json();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.permission !== undefined) updates.permission = body.permission;
  if (body.expires_at !== undefined) updates.expires_at = body.expires_at;

  const { data: updated, error: updateError } = await supabase
    .from("shared_media")
    .update(updates)
    .eq("id", share!.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update share permission" },
      { status: 500 },
    );
  }

  return NextResponse.json({ share: updated });
}

// ── DELETE /api/media/share/[shareId] ────────────────────────────────────────
// Remove a specific shared_media row.

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { share, err } = await getShareRow(supabase, shareId, user.id);
  console.log(share, err);

  if (err === "Share not found") {
    return NextResponse.json({ error: err }, { status: 404 });
  }
  if (err === "Forbidden") {
    return NextResponse.json({ error: err }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from("shared_media")
    .delete()
    .eq("id", share!.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to remove share" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Share removed successfully" });
}

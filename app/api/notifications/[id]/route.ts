
// app/api/notifications/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ── PATCH /api/notifications/[id] — mark a single notification as read ────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the notification belongs to this user
  const { data: notif, error: fetchError } = await supabase
    .from("notifications")
    .select("id, receiver_id")
    .eq("id", id)
    .single();

  if (fetchError || !notif) {
    return NextResponse.json(
      { error: "Notification not found" },
      { status: 404 },
    );
  }

  if (notif.receiver_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Notification marked as read" });
}

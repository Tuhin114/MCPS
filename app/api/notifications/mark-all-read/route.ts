// app/api/notifications/mark-all-read/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ── PATCH /api/notifications/mark-all-read ────────────────────────────────────

export async function PATCH() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  if (error) {
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "All notifications marked as read" });
}

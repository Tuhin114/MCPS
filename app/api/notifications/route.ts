

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { CreateNotificationPayload } from "@/types/notification.ts";

//  GET /api/notifications
// Returns enriched notifications + unread count for the authenticated user.

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_notification_details", {
    p_receiver_id: user.id,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }

  const notifications = data ?? [];
  const unread_count = notifications.filter(
    (n: { is_read: boolean }) => !n.is_read,
  ).length;

  return NextResponse.json({ notifications, unread_count });
}

//  POST /api/notifications ─
// Creates a new notification row. Caller must be the sender (authenticated user).

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreateNotificationPayload = await req.json();

  console.log("auth user:", user.id);

  const payload = {
    media_id: body.media_id,
    sender_id: user.id,
    receiver_id: body.receiver_id,
    type: body.type ?? "Share",
    action: body.action,
  };

  console.log("payload:", payload);

  if (!body.media_id || !body.receiver_id || !body.action) {
    return NextResponse.json(
      { error: "media_id, receiver_id, and action are required" },
      { status: 400 },
    );
  }

  // Guard: don't notify yourself
  if (body.receiver_id === user.id) {
    return NextResponse.json(
      { error: "Cannot send notification to yourself" },
      { status: 400 },
    );
  }

  const { error: insertError } = await supabase.from("notifications").insert({
    media_id: body.media_id,
    sender_id: user.id,
    receiver_id: body.receiver_id,
    type: body.type ?? "Share",
    action: body.action,
  });

  if (insertError) {
    console.error("Notification Insert Error:", insertError);

    return NextResponse.json(
      {
        error: insertError.message,
        details: insertError,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}


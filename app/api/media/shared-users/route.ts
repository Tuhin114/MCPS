import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSharedUsers } from "@/services/media.service";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sharedUsers = await getSharedUsers(supabase, user.id);

    return NextResponse.json({ shared_users: sharedUsers });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shared users";
    console.error("GET /api/media/shared-users Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

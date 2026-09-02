

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSharedWithMeMediaList } from "@/services/sharedwithme.service";

export async function GET(request: Request) {
  const supabase = await createClient();
  try {

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await getSharedWithMeMediaList(supabase, user.id);

    return NextResponse.json({ media });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch media";
    console.error("[GET /api/media/lists] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



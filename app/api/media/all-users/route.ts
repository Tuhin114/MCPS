import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllUsers } from "@/services/media.service";
import { AllUsers } from "@/types/media";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = req.nextUrl.searchParams.get("email");
    console.log("Search Email:", email);

    if (!email?.trim()) {
      return NextResponse.json([]);
    }

    const users = await getAllUsers(supabase);

    const matches = users
      .filter((u: AllUsers) =>
        u.email?.toLowerCase().includes(email.toLowerCase()),
      )
      .map((u: AllUsers) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        avatar_url: u.avatar_url,
      }));

    return NextResponse.json(matches);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search users";

    console.error("GET /api/media/all-users Error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

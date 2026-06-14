// app/api/profiles/[id]/avatar/route.ts

import { createClient } from "@/lib/supabase/server";
import { uploadAvatar } from "@/services/profiles.services";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

//  POST /api/profiles/[id]/avatar

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const avatarField = formData.get("avatar");

    if (!avatarField || !(avatarField instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid avatar file" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(avatarField.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." },
        { status: 415 },
      );
    }

    if (avatarField.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 },
      );
    }

    const profile = await uploadAvatar(supabase, id, avatarField);
    return NextResponse.json({ profile }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

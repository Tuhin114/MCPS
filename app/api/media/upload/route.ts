import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/services/media.service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const encryption = formData.get("encryption");
    const watermark = formData.get("watermark");
    const watermarkText = formData.get("watermarkText");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const media = await uploadMedia(supabase, user.id, {
      file,
      encryption: encryption === "true" ? true : false,
      watermark: watermark === "true" ? true : false,
      watermarkText: watermarkText as string,
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

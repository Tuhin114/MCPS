import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/services/media.service";
import { validateUpload } from "@/lib/upload-validation";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

// 20 uploads per 15 minutes per user — generous for normal use, tight
// enough to blunt someone scripting repeated large uploads.
const UPLOAD_LIMIT = 20;
const UPLOAD_WINDOW_MS = 15 * 60 * 1000;

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

    const limitResult = rateLimit(
      `upload:${user.id}`,
      UPLOAD_LIMIT,
      UPLOAD_WINDOW_MS,
    );
    if (!limitResult.allowed) {
      return rateLimitResponse(limitResult);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const encryption = formData.get("encryption");
    const watermark = formData.get("watermark");
    const watermarkText = formData.get("watermarkText");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side validation — the <input accept> attribute in the UI is
    // only a hint and does not protect this endpoint on its own.
    const validation = validateUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
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

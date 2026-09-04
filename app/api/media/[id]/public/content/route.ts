
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prepareMediaBuffer, MediaServingError } from "@/lib/media-serving";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { Media } from "@/types/media";

const BUCKET = "protected-media";

// 60 requests per minute per IP — generous enough for a page that embeds
// the file (e.g. <img>/<video> re-fetching), tight enough to blunt scraping
// or bandwidth abuse of a public link.
const PUBLIC_CONTENT_LIMIT = 60;
const PUBLIC_CONTENT_WINDOW_MS = 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ip = getClientIp(request);
    const limitResult = rateLimit(
      `public-content:${ip}`,
      PUBLIC_CONTENT_LIMIT,
      PUBLIC_CONTENT_WINDOW_MS,
    );
    if (!limitResult.allowed) {
      return rateLimitResponse(limitResult);
    }

    const { id } = await params;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: media, error } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single<Media>();

    if (error || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    if (!media.is_public) {
      return NextResponse.json(
        { error: "This file is not publicly accessible" },
        { status: 403 },
      );
    }

    const { data: blob, error: storageError } = await supabase.storage
      .from(BUCKET)
      .download(media.storage_path);

    if (storageError || !blob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    let fileBuffer: Buffer;
    try {
      fileBuffer = await prepareMediaBuffer(media, blob);
    } catch (err) {
      if (err instanceof MediaServingError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.status },
        );
      }
      throw err;
    }

    // Public downloads count too — same signal as authenticated ones.
    await supabase
      .from("media")
      .update({ download_count: (media.download_count ?? 0) + 1 })
      .eq("id", id);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": media.mime_type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${media.file_name}"`,
        "Content-Length": String(fileBuffer.byteLength),
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

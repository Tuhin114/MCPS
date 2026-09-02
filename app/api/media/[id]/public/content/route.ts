
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "protected-media";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(id);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: media, error } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single();

    console.log(media);
    console.log(error);

    if (error || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    if (media.is_encrypted) {
      return NextResponse.json(
        { error: "This media is private" },
        { status: 403 },
      );
    }

    const { data: blob, error: storageError } = await supabase.storage
      .from(BUCKET)
      .download(media.storage_path);

    if (storageError || !blob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": media.mime_type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${media.file_name}"`,
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

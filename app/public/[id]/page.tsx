import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PublicMediaClient } from "./public-media-client";

export default function PublicMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PublicMediaLoading />}>
      <PublicMediaServer params={params} />
    </Suspense>
  );
}

async function PublicMediaServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicMediaClient id={id} />;
}

function PublicMediaLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground mt-3">Loading file…</p>
    </div>
  );
}

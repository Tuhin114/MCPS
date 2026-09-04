"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Globe, Check, Copy } from "lucide-react";
import { useUpdateMedia } from "@/hooks/useMediaAction";
import { MyMediaItem } from "@/types/media";
import { isWatermarkSupported } from "@/lib/watermark/watermark-support";
import { toast } from "sonner";

interface UpdateDialogProps {
  item: MyMediaItem;
  onUpdate?: (
    item: MyMediaItem,
    name: string,
    encrypted: boolean,
    watermarked: boolean,
    watermarkText: string,
    isPublic: boolean,
  ) => void; // optional optimistic callback
  trigger?: React.ReactNode;
  onDialogClose?: () => void;
}

export function UpdateDialog({
  item,
  onUpdate,
  trigger,
  onDialogClose,
}: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.file_name);
  const [encrypted, setEncrypted] = useState(item.is_encrypted ?? false);
  const [watermarked, setWatermarked] = useState(item.is_watermarked ?? false);
  const [watermarkText, setWatermarkText] = useState(item.watermark_text || "");
  const [isPublic, setIsPublic] = useState(item.is_public ?? false);
  const [copied, setCopied] = useState(false);

  const { mutateAsync: updateMediaAsync, isPending } = useUpdateMedia();

  // Watermarking only actually does anything for images and PDFs today
  // (see lib/watermark/watermark.ts) — everything else is a silent no-op
  // server-side, so the toggle is disabled here instead of implying a
  // feature that won't apply.
  const watermarkSupported = isWatermarkSupported(item.mime_type);

  const publicLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/public/${item.id}`
      : `/public/${item.id}`;

  const handleOpenChange = (val: boolean) => {
    if (isPending) return;
    setOpen(val);
    if (!val) onDialogClose?.();
  };

  const handleEncryptionChange = (checked: boolean) => {
    if (!checked) {
      toast.warning(
        "Switching off encryption will make the media public. Anyone with a shareable link can access it. But your watermark will still be visible.",
      );
    }

    setEncrypted(checked);

    // Encryption OFF => disable watermark
    if (!checked) {
      setWatermarked(false);
    }

    // Encryption ON => enable watermark (only if this file type supports it)
    if (checked && watermarkSupported) {
      setWatermarked(true);
    }
  };

  const handleWatermarkChange = (checked: boolean) => {
    if (!watermarkSupported) {
      toast.warning(
        `Watermarking isn't available for ${item.mime_type || "this file type"} yet — currently supported for images and PDFs only.`,
      );
      return;
    }

    if (!encrypted) {
      toast.warning("Enable encryption before enabling watermark protection.");
      return;
    }

    setWatermarked(checked);
  };

  const handlePublicChange = (checked: boolean) => {
    if (checked) {
      toast.warning(
        "Anyone with the link will be able to view and download this file — no sign-in required. This applies even if the file is encrypted or watermarked.",
      );
    }
    setIsPublic(checked);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast.success("Public link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link — copy it manually");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      await updateMediaAsync({
        id: item.id,
        payload: {
          file_name: name,
          is_encrypted: encrypted,
          is_watermarked: watermarked,
          watermark_text: watermarked ? watermarkText : undefined,
          is_public: isPublic,
        },
      });

      // Only reached if the mutation actually resolved successfully.
      // (The success toast is fired by the parent's onUpdate handler in
      // MyMedia.tsx — not duplicated here.)
      onUpdate?.(item, name, encrypted, watermarked, watermarkText, isPublic);
      setOpen(false);
      onDialogClose?.();
    } catch (err) {
      // Previously a failed update just left the dialog open with no
      // feedback at all. Now it's explicit.
      toast.error(
        err instanceof Error ? err.message : "Failed to update media",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Media</DialogTitle>
          <DialogDescription>
            Modify media protection settings and details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="media-name">Media Name</Label>
            <Input
              id="media-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="File name"
              className="bg-surface border-border"
              disabled={isPending}
            />
          </div>

          {/* Encryption */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption" className="font-medium">
                Encryption
              </Label>
              <Switch
                id="encryption"
                checked={encrypted}
                onCheckedChange={handleEncryptionChange}
                disabled={isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable encryption for this media file
            </p>
          </div>

          {/* Watermark */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="watermark"
                className={`font-medium ${!watermarkSupported ? "text-muted-foreground" : ""}`}
              >
                Watermark
              </Label>
              <Switch
                id="watermark"
                checked={watermarked}
                onCheckedChange={handleWatermarkChange}
                disabled={isPending || !encrypted || !watermarkSupported}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {watermarkSupported
                ? "Add a watermark to protect content"
                : "Not available for this file type — supported for images and PDFs only"}
            </p>

            {watermarked && watermarkSupported && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g., CONFIDENTIAL"
                  className="bg-surface border-border text-xs"
                  disabled={isPending || !encrypted || !watermarked}
                />
              </div>
            )}
          </div>

          {/* Public Link */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="public-link"
                className="font-medium flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" />
                Public Link
              </Label>
              <Switch
                id="public-link"
                checked={isPublic}
                onCheckedChange={handlePublicChange}
                disabled={isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with the link can view this file — no account needed.
            </p>

            {isPublic && (
              <div className="flex items-center gap-2 pt-1">
                <Input
                  readOnly
                  value={publicLink}
                  className="bg-surface border-border text-xs font-mono"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isPending || !name.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Saving…
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

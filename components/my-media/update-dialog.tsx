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
import { Loader2 } from "lucide-react";
import { useUpdateMedia } from "@/hooks/useMediaAction";
import { MyMediaItem } from "@/types/media";
import { toast } from "sonner";

interface UpdateDialogProps {
  item: MyMediaItem;
  onUpdate?: (
    item: MyMediaItem,
    name: string,
    encrypted: boolean,
    watermarked: boolean,
    watermarkText: string,
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

  const { mutate: updateMedia, isPending } = useUpdateMedia();

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

    // Encryption ON => enable watermark
    if (checked) {
      setWatermarked(true);
    }
  };

  const handleWatermarkChange = (checked: boolean) => {
    if (!encrypted) {
      toast.warning("Enable encryption before enabling watermark protection.");
      return;
    }

    setWatermarked(checked);
  };

  const handleUpdate = () => {
    if (!name.trim()) return;

    updateMedia(
      {
        id: item.id,
        payload: {
          file_name: name,
          is_encrypted: encrypted,
          is_watermarked: watermarked,
          watermark_text: watermarked ? watermarkText : null,
        },
      },
      {
        onSuccess: () => {
          // Fire optimistic callback so MyMedia local state stays in sync
          // until the next query invalidation resolves
          onUpdate?.(item, name, encrypted, watermarked, watermarkText);
          setOpen(false);
          onDialogClose?.();
        },
      },
    );
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
              <Label htmlFor="watermark" className="font-medium">
                Watermark
              </Label>
              <Switch
                id="watermark"
                checked={watermarked}
                onCheckedChange={handleWatermarkChange}
                disabled={isPending || !encrypted}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Add a watermark to protect content
            </p>

            {watermarked && (
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

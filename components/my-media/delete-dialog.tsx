"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDeleteMedia } from "@/hooks/useMediaAction";
import { MyMediaItem } from "@/types/media";
import { toast } from "sonner";

interface DeleteDialogProps {
  item: MyMediaItem;
  onDelete?: (item: MyMediaItem) => void;
  trigger?: React.ReactNode;
  onDialogClose?: () => void;
}

export function DeleteDialog({
  item,
  onDelete,
  trigger,
  onDialogClose,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteMediaAsync, isPending } = useDeleteMedia();

  const handleOpenChange = (val: boolean) => {
    if (isPending) return;
    setOpen(val);
    if (!val) onDialogClose?.();
  };

  const handleDelete = async () => {
    try {
      await deleteMediaAsync(item.id);
      onDelete?.(item); // fire optimistic removal if parent still wants it
      setOpen(false);
      onDialogClose?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete media",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{item.file_name}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

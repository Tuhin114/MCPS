"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { SharedUsersAvatar } from "./shared-users-avatar";
import { UpdateDialog } from "./update-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Download, MoreHorizontal, Eye } from "lucide-react";

import { formatFileSize } from "@/lib/dashboard-utils";
import { formatDate } from "@/lib/helper";
import { ShareMediaDialog } from "./share-dialog";
import { MyMediaItem } from "@/types/media";
import { FileTypeBadge } from "./FileTypeBadge";

interface MediaTableProps {
  items: MyMediaItem[];
  isLoading?: boolean;
  onShare: (item: MyMediaItem, emails: string[]) => void;
  onUpdate: (
    item: MyMediaItem,
    name: string,
    encrypted: boolean,
    watermarked: boolean,
    watermarkText: string,
  ) => void;
  onDelete: (item: MyMediaItem) => void;
  onDownload: (item: MyMediaItem) => void;
}

function ActionsDropdown({
  item,
  onUpdate,
  onDelete,
  onDownload,
}: {
  item: MyMediaItem;
  onShare: (item: MyMediaItem, emails: string[]) => void;
  onUpdate: MediaTableProps["onUpdate"];
  onDelete: (item: MyMediaItem) => void;
  onDownload: (item: MyMediaItem) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* View */}
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => onDownload(item)}
        >
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Update — renders its own dialog, we use asChild pattern */}
        <UpdateDialog
          item={item}
          onUpdate={onUpdate}
          trigger={
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={(e) => e.preventDefault()} // prevent dropdown closing before dialog opens
            >
              Update
            </DropdownMenuItem>
          }
        />

        {/* Delete — same pattern */}
        <DeleteDialog
          item={item}
          onDelete={onDelete}
          trigger={
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MediaTable({
  items,
  isLoading = false,
  onShare,
  onUpdate,
  onDelete,
  onDownload,
}: MediaTableProps) {
  console.log(items);
  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/40">
              <TableHead className="text-foreground font-semibold">
                Name
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Size
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Uploaded
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Status
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Type
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Shared With
              </TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-border">
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center justify-center min-h-[300px] p-8">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              No media files found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/40">
            <TableHead className="text-foreground font-semibold">
              Name
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Size
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Uploaded
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Status
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Type
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Shared With
            </TableHead>
            <TableHead className="text-right text-foreground font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="border-border hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium text-foreground max-w-xs truncate">
                {item.file_name}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatFileSize(item.size_bytes)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(item.created_at)}
              </TableCell>
              <TableCell>
                <StatusBadge
                  is_encrypted={item.is_encrypted}
                  is_watermarked={item.is_watermarked}
                />
              </TableCell>
              <TableCell>
                <FileTypeBadge mimeType={item.mime_type} />
              </TableCell>
              <TableCell>
                {item.shared_with.length > 0 ? (
                  <SharedUsersAvatar users={item.shared_with} />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not Shared
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => onDownload(item)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <ShareMediaDialog item={item} onShare={onShare} />

                  <ActionsDropdown
                    item={item}
                    onShare={onShare}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onDownload={onDownload}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

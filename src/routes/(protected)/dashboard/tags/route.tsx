import { useState } from "react";

import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisIcon, FrameIcon, PlusIcon } from "lucide-react";

import type { Tag } from "@/db/schema/recipes";
import { tagsCollection } from "@/lib/collections";
import { cn } from "@/lib/utils";

import { TagForm } from "@/components/forms/collections/tag";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/(protected)/dashboard/tags")({
  ssr: false,
  component: TagsRoute,
});

function TagsRoute() {
  const [open, setOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const { data: tags } = useLiveQuery((q) => q.from({ tag: tagsCollection }));

  const tag = tags.find((cat) => cat.id === modalId);

  function handleOpen(id: string | null) {
    setModalId(id);
    setOpen(true);
  }

  function handleClose() {
    setModalId(null);
    setOpen(false);
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">Tags</h1>
        <Button
          className={cn("cursor-pointer", !tags.length && "hidden")}
          onClick={() => handleOpen(null)}>
          <PlusIcon />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        {tags.length ? (
          <TagTable tags={tags} handleOpen={handleOpen} />
        ) : (
          <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FrameIcon />
              </EmptyMedia>
              <EmptyTitle>No Tags</EmptyTitle>
              <EmptyDescription>Create a tag. New tags will appear here.</EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <Button variant="outline" className="cursor-pointer" onClick={() => handleOpen(null)}>
                Create
              </Button>
            </EmptyContent>
          </Empty>
        )}

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Tag</DialogTitle>
            <DialogDescription>{tag ? "Edit this tag." : "Create a new tag."}</DialogDescription>
          </DialogHeader>
          <TagForm tag={tag} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TagTable({
  tags,
  handleOpen,
}: {
  tags: Array<Tag> | null;
  handleOpen: (id: string) => void;
}) {
  if (!tags || !tags.length) return null;

  function handleDelete(id: string) {
    tagsCollection.delete(id);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id} className="odd:bg-muted/25">
            <TableCell>{tag.id}</TableCell>
            <TableCell>{tag.title}</TableCell>
            <TableCell>{tag.slug}</TableCell>
            <TableCell className="w-12">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex size-6 cursor-pointer items-center justify-center"
                  aria-label="Toggle menu">
                  <EllipsisIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-muted-foreground truncate text-sm">
                    {tag.title}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpen(tag.id)}>
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer">
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the tag.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => handleDelete(tag.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

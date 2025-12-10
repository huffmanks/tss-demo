import { useState } from "react";

import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { EarthIcon, EllipsisIcon, PlusIcon } from "lucide-react";

import type { Cuisine } from "@/db/schema/recipes";
import { cuisinesCollection } from "@/lib/collections";
import { cn } from "@/lib/utils";

import { CuisineForm } from "@/components/forms/collections/cuisine";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export const Route = createFileRoute("/(protected)/dashboard/cuisines")({
  ssr: false,
  component: CuisinesRoute,
});

function CuisinesRoute() {
  const [open, setOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const { data: cuisines } = useLiveQuery((q) => q.from({ cuisine: cuisinesCollection }));

  const cuisine = cuisines.find((cat) => cat.id === modalId);

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
        <h1 className="text-xl font-bold">Cuisines</h1>
        <Button
          className={cn("cursor-pointer", !cuisines.length && "hidden")}
          onClick={() => handleOpen(null)}>
          <PlusIcon />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        {cuisines.length ? (
          <CuisineTable cuisines={cuisines} handleOpen={handleOpen} />
        ) : (
          <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <EarthIcon />
              </EmptyMedia>
              <EmptyTitle>No Cuisines</EmptyTitle>
              <EmptyDescription>Create a cuisine. New cuisines will appear here.</EmptyDescription>
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
            <DialogTitle>Cuisine</DialogTitle>
            <DialogDescription>
              {cuisine ? "Edit this cuisine." : "Create a new cuisine."}
            </DialogDescription>
          </DialogHeader>
          <CuisineForm cuisine={cuisine} handleClose={handleClose}>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                {cuisine ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </CuisineForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CuisineTable({
  cuisines,
  handleOpen,
}: {
  cuisines: Array<Cuisine> | null;
  handleOpen: (id: string) => void;
}) {
  if (!cuisines || !cuisines.length) return null;

  function handleDelete(id: string) {
    cuisinesCollection.delete(id);
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
        {cuisines.map((cuisine) => (
          <TableRow key={cuisine.id} className="odd:bg-muted/25">
            <TableCell>{cuisine.id}</TableCell>
            <TableCell>{cuisine.title}</TableCell>
            <TableCell>{cuisine.slug}</TableCell>
            <TableCell className="w-12">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex size-6 cursor-pointer items-center justify-center"
                  aria-label="Toggle menu">
                  <EllipsisIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-muted-foreground truncate text-sm">
                    {cuisine.title}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleOpen(cuisine.id)}>
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
                          This action cannot be undone. This will permanently delete the cuisine.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => handleDelete(cuisine.id)}>
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

import { useState } from "react";

import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenIcon, EllipsisIcon, PlusIcon } from "lucide-react";

import type { Category } from "@/db/schema/recipes";
import { categoriesCollection } from "@/electric/collections";
import { cn } from "@/lib/utils";

import { CategoryForm } from "@/components/forms/collections/category";
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

export const Route = createFileRoute("/(protected)/$orgId/$teamId/dashboard/categories")({
  ssr: false,
  component: CategoriesRoute,
});

function CategoriesRoute() {
  const [open, setOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const { data: categories } = useLiveQuery((q) => q.from({ category: categoriesCollection }));

  const category = categories.find((cat) => cat.id === modalId);

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
        <h1 className="text-xl font-bold">Categories</h1>
        <Button
          className={cn("cursor-pointer", !categories.length && "hidden")}
          onClick={() => handleOpen(null)}>
          <PlusIcon />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        {categories.length ? (
          <CategoryTable categories={categories} handleOpen={handleOpen} />
        ) : (
          <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>No Categories</EmptyTitle>
              <EmptyDescription>
                Create a category. New categories will appear here.
              </EmptyDescription>
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
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              {category ? "Edit this category." : "Create a new category."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={category} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryTable({
  categories,
  handleOpen,
}: {
  categories: Array<Category> | null;
  handleOpen: (id: string) => void;
}) {
  if (!categories || !categories.length) return null;

  function handleDelete(id: string) {
    categoriesCollection.delete(id);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id} className="odd:bg-muted/25">
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.title}</TableCell>
            <TableCell className="w-12">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex size-6 cursor-pointer items-center justify-center"
                  aria-label="Toggle menu">
                  <EllipsisIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-muted-foreground truncate text-sm">
                    {category.title}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleOpen(category.id)}>
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
                          This action cannot be undone. This will permanently delete the category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => handleDelete(category.id)}>
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

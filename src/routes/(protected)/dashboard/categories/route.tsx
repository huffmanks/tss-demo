import { useState } from "react";

import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisIcon, PlusIcon } from "lucide-react";

import type { Category } from "@/db/schema/recipes";
import { categoriesCollection } from "@/lib/collections";

import { CategoryForm } from "@/components/forms/collections/category";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/(protected)/dashboard/categories")({
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
        <Button className="cursor-pointer" onClick={() => handleOpen(null)}>
          <PlusIcon />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <CategoryTable categories={categories} handleOpen={handleOpen} />

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              {category ? "Edit this category." : "Create a new category."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={category} handleClose={handleClose}>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                {category ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </CategoryForm>
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
        {categories.map((category) => (
          <TableRow key={category.id} className="odd:bg-muted/25">
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.title}</TableCell>
            <TableCell>{category.slug}</TableCell>
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
                  <DropdownMenuItem className="cursor-pointer">
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

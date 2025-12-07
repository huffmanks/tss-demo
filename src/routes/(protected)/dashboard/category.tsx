import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";

import { Category } from "@/db/schema";
import { categoriesCollection } from "@/lib/collections";

import { CategoryForm } from "@/components/forms/collections/category";

export const Route = createFileRoute("/(protected)/dashboard/category")({
  ssr: false,
  component: CategoryRoute,
});

function CategoryRoute() {
  const { data: categories, isLoading } = useLiveQuery((q) =>
    q.from({ category: categoriesCollection })
  );

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Dashboard page</h1>
      <CategoryForm />
      <List categories={categories} isLoading={isLoading} />
    </div>
  );
}

function List({ categories, isLoading }: { categories?: Category[]; isLoading: boolean }) {
  if (isLoading || !categories?.length) return null;

  return (
    <>
      {categories.map((category) => (
        <div key={category.id}>{category.title}</div>
      ))}
    </>
  );
}

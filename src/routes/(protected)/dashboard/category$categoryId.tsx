import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";

import { categoriesCollection } from "@/lib/collections";

import { CategoryForm } from "@/components/forms/collections/category";

export const Route = createFileRoute("/(protected)/dashboard/category$categoryId")({
  ssr: false,
  component: CategoryRoute,
  loader: ({ params }) => {
    return {
      categoryId: params.categoryId,
    };
  },
});

function CategoryRoute() {
  const { categoryId } = Route.useLoaderData();

  const { data: category } = useLiveQuery((q) =>
    q
      .from({ category: categoriesCollection })
      .where(({ category }) => eq(category.id, categoryId))
      .findOne()
  );
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Dashboard page</h1>
      <CategoryForm category={category} />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { RecipeForm } from "@/components/forms/collections/recipe";

export const Route = createFileRoute("/(protected)/$orgId/dashboard/recipes/add")({
  component: AddRecipeRoute,
});

function AddRecipeRoute() {
  return (
    <div className="p-4">
      <RecipeForm userId="sadf" organizationId="sfsdfg" />
    </div>
  );
}

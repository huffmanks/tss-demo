import { createFileRoute } from "@tanstack/react-router";

import { RecipeForm } from "@/components/forms/collections/recipe";

export const Route = createFileRoute("/(protected)/dashboard/recipes")({
  component: RecipesRoute,
});
function RecipesRoute() {
  return (
    <div className="p-4">
      <RecipeForm userId={"sadf"} />
    </div>
  );
}

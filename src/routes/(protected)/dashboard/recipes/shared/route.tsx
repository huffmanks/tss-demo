import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/recipes/shared")({
  component: SharedRecipesRoute,
});

function SharedRecipesRoute() {
  return (
    <div className="p-4">
      <div>List of all recipes shared with you.</div>
    </div>
  );
}

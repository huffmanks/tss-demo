import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/$teamId/dashboard/recipes/")({
  component: RecipesRoute,
});
function RecipesRoute() {
  return (
    <div className="p-4">
      <div>List of all your recipes.</div>
    </div>
  );
}

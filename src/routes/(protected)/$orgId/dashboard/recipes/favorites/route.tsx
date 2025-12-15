import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/dashboard/recipes/favorites")({
  component: FavoriteRecipesRoute,
});

function FavoriteRecipesRoute() {
  return (
    <div className="p-4">
      <div>List of all your favorite recipes.</div>
    </div>
  );
}

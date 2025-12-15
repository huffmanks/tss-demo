import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/dashboard/recipes/shared")({
  component: SharedRecipesRoute,
});

function SharedRecipesRoute() {
  // async function getRecipesSharedWithOrganization(targetOrgId: string) {
  //   // 1. Join recipes with the recipeShares table.
  //   // 2. Filter the join result where the targetOrganizationId matches the viewer's organization ID.
  //   // 3. Exclude recipes where the recipe's owner (organizationId) is the same as the targetOrgId.
  //   const sharedRecipes = await db
  //     .select({
  //       id: recipes.id,
  //       title: recipes.title,
  //       slug: recipes.slug,
  //       description: recipes.description,
  //       // Include other recipe fields you need
  //       sourceOrgId: recipeShares.sourceOrganizationId,
  //     })
  //     .from(recipes)
  //     .innerJoin(
  //       recipeShares,
  //       eq(recipes.id, recipeShares.recipeId)
  //     )
  //     .where(
  //       and(
  //         // Filter: The recipe must be shared *with* the target organization.
  //         eq(recipeShares.targetOrganizationId, targetOrgId),

  //         // Exclusion: The recipe must NOT be owned by the target organization.
  //         ne(recipes.organizationId, targetOrgId)
  //       )
  //     );

  //   return sharedRecipes;
  // }

  return (
    <div className="p-4">
      <div>List of all recipes shared with you.</div>
    </div>
  );
}

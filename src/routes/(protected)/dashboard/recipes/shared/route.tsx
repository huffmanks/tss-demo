import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/recipes/shared")({
  component: SharedRecipesRoute,
});

function SharedRecipesRoute() {
  // can share with whole org. if this teamId must be set to null
  // can share with just team.
  // const sharedRecipes = await db
  // .select()
  // .from(recipeShares)
  // .where(
  //   or(
  //     // Condition 1: Shared with the user's specific team
  //     eq(recipeShares.teamId, userTeamId),

  //     // Condition 2: Shared with the user's entire organization (teamId is NULL)
  //     and(
  //       eq(recipeShares.organizationId, userOrgId),
  //       isNull(recipeShares.teamId)
  //     )
  //   )
  // )
  // .all();
  return (
    <div className="p-4">
      <div>List of all recipes shared with you.</div>
    </div>
  );
}

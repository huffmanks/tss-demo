import { createFileRoute } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";
import { doesOrganizationExist } from "@/fn/onboarding";

import { CreateFirstOrgTeamForm } from "@/components/forms/onboarding/create-first-org-team";

export const Route = createFileRoute("/(protected)/onboarding/first-user")({
  component: DashboardOnboardingRoute,
  loader: async () => {
    const { user } = await authUser();

    return {
      doesOrganizationExist: await doesOrganizationExist(),
      userId: user.id,
    };
  },
});

function DashboardOnboardingRoute() {
  const data = Route.useLoaderData();

  return (
    <CreateFirstOrgTeamForm
      doesOrganizationExist={data.doesOrganizationExist}
      userId={data.userId}
    />
  );
}

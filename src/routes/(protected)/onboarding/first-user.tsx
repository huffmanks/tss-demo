import { createFileRoute } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";
import { doesOrganizationExist } from "@/fn/onboarding";

import { CreateFirstOrgForm } from "@/components/forms/onboarding/create-first-org";

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

  return <CreateFirstOrgForm userId={data.userId} />;
}

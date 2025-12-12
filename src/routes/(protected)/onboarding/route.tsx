import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";
import { doesOrgExist } from "@/fn/onboarding";

import { CreateOrgForm } from "@/components/forms/auth/create-org";

export const Route = createFileRoute("/(protected)/onboarding")({
  component: DashboardOnboardingRoute,
  loader: async () => {
    const orgExists = await doesOrgExist();

    if (orgExists) {
      throw redirect({
        to: "/dashboard/recipes",
        replace: true,
      });
    }

    return await authUser();
  },
});

function DashboardOnboardingRoute() {
  const { user, orgId } = Route.useLoaderData();
  const navigate = useNavigate();

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!orgId) {
    navigate({ to: "/dashboard/recipes" });
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateOrgForm userId={user.id} />
      </div>
    </div>
  );
}

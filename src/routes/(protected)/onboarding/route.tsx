import { createFileRoute, redirect } from "@tanstack/react-router";

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

    const { user } = await authUser();
    return user;
  },
});

function DashboardOnboardingRoute() {
  const user = Route.useLoaderData();

  if (!user) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateOrgForm userId={user.id} />
      </div>
    </div>
  );
}

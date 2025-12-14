import { createFileRoute } from "@tanstack/react-router";

import { doesOrganizationExist, doesUserExist } from "@/fn/onboarding";

import { SignupForm } from "@/components/forms/auth/signup";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupRoute,
  loader: async () => {
    const userExist = await doesUserExist();
    const orgExist = await doesOrganizationExist();

    return { userExist, orgExist };
  },
});

function SignupRoute() {
  const data = Route.useLoaderData();

  return <SignupForm doesOrganizationExist={data.orgExist} doesUserExist={data.userExist} />;
}

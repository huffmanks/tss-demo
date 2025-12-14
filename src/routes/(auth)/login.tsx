import { createFileRoute } from "@tanstack/react-router";

import { doesOrganizationExist } from "@/fn/onboarding";

import { LoginForm } from "@/components/forms/auth/login";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginRoute,
  loader: async () => await doesOrganizationExist(),
});

function LoginRoute() {
  const data = Route.useLoaderData();

  return <LoginForm doesOrganizationExist={data} />;
}

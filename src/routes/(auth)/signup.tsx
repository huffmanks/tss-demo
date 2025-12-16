import { createFileRoute, notFound } from "@tanstack/react-router";

import { doesUserExist } from "@/fn/onboarding";

import { SignupForm } from "@/components/forms/auth/signup";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupRoute,
  beforeLoad: async () => {
    const userExist = await doesUserExist();

    if (userExist) {
      throw notFound();
    }
  },
});

function SignupRoute() {
  return <SignupForm />;
}

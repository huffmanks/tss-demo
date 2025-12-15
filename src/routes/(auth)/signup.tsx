import { createFileRoute, redirect } from "@tanstack/react-router";

import { doesUserExist } from "@/fn/onboarding";

import { SignupForm } from "@/components/forms/auth/signup";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupRoute,
  loader: async () => {
    const userExist = await doesUserExist();

    if (userExist) {
      throw redirect({
        to: "/login",
        replace: true,
      });
    }
    return null;
  },
});

function SignupRoute() {
  return <SignupForm />;
}

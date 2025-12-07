import { createFileRoute } from "@tanstack/react-router";

import { SignupForm } from "@/components/forms/auth/signup";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupRoute,
});

function SignupRoute() {
  return <SignupForm />;
}

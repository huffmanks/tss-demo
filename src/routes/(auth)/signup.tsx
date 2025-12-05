import { createFileRoute } from "@tanstack/react-router";

import { SignupForm } from "@/components/signup-form";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupRoute,
});

function SignupRoute() {
  return <SignupForm />;
}

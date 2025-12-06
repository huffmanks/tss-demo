import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/components/forms/login";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return <LoginForm />;
}

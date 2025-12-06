import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/components/forms/forgot-password";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  return <ForgotPasswordForm />;
}

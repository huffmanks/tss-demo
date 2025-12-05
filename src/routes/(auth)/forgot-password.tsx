import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  return <ForgotPasswordForm />;
}

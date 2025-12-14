import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/onboarding/join")({
  component: OnboardingJoinRoute,
});

function OnboardingJoinRoute() {
  return <div className="text-red-500">OnboardingJoin page</div>;
}

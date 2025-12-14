import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/$teamId/dashboard/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  return <div className="text-red-500">Profile page</div>;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/$teamId/dashboard/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return <div className="text-red-500">Settings page</div>;
}

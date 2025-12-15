import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return <div className="text-red-500">Settings page</div>;
}

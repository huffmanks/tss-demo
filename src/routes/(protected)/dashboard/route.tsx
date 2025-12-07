import { Outlet, createFileRoute } from "@tanstack/react-router";

import { loggedOut } from "@/middleware/auth";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardRoute,
  server: {
    middleware: [loggedOut],
  },
});

function DashboardRoute() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
}

import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { checkAdminStatus } from "@/fn/auth";

export const Route = createFileRoute("/(protected)/admin")({
  component: AdminRoute,
  beforeLoad: async () => {
    const { role } = await checkAdminStatus();

    if (role === "none") {
      throw notFound();
    }

    if (role !== "admin") {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
});

function AdminRoute() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <div>Admin layout</div>
      <Outlet />
    </div>
  );
}

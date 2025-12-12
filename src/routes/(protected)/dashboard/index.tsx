import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/")({
  component: DashboardRedirect,
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/recipes",
      replace: true,
    });
  },
});

function DashboardRedirect() {
  return null;
}

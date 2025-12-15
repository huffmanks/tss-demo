import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/$orgId/dashboard/organizations/$id")({
  component: OrganizationsIdRoute,
});

function OrganizationsIdRoute() {
  return <div className="text-red-500">OrganizationsId page</div>;
}

import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <div>Admin layout</div>
      <Outlet />
    </div>
  );
}

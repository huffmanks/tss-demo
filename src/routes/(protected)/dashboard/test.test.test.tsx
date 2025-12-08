import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/test/test/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/dashboard/test/test/test"!</div>;
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { authUser } from "@/fn/helpers";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  loader: async () => {
    return await authUser();
  },
});

function Dashboard() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();

  if (!user) navigate({ href: "/" });

  return <div>Dashboard page</div>;
}

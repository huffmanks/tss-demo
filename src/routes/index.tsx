import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { doesUserExist } from "@/fn/onboarding";

export const Route = createFileRoute("/")({
  component: RootComponent,
  beforeLoad: async () => {
    if (!(await doesUserExist())) {
      throw redirect({ to: "/signup", replace: true });
    } else {
      throw redirect({ to: "/login", replace: true });
    }
  },
});

function RootComponent() {
  return <Outlet />;
}

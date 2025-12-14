import { createFileRoute, redirect } from "@tanstack/react-router";

import { doesUserExist } from "@/fn/onboarding";
import { redirectIfAuthenticated } from "@/middleware/auth";

export const Route = createFileRoute("/")({
  server: {
    middleware: [redirectIfAuthenticated],
  },
  beforeLoad: async () => {
    if (!(await doesUserExist())) {
      throw redirect({ to: "/signup" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});

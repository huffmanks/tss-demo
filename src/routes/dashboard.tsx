import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { loggedOut } from "@/middleware/auth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  server: {
    middleware: [loggedOut],
  },
});

function Dashboard() {
  const navigate = useNavigate();

  async function signOut() {
    await authClient.signOut();

    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-xl font-bold">Dashboard page</h1>

      <div className="flex items-center gap-4">
        <button onClick={signOut}>Logout</button>
      </div>
    </div>
  );
}

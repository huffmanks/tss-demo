import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { loggedIn } from "@/middleware/auth";

export const Route = createFileRoute("/")({
  component: Home,
  server: {
    middleware: [loggedIn],
  },
});

function Home() {
  const navigate = useNavigate();

  async function signUp() {
    await authClient.signUp.email({ name: "ted", email: "user@email.com", password: "password" });
  }

  async function signIn() {
    await authClient.signIn.email({ email: "user@email.com", password: "password" });

    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-xl font-bold">Home page</h1>

      <div className="flex items-center gap-4">
        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Sign in</button>
      </div>
    </div>
  );
}

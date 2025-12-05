import { Link, createFileRoute } from "@tanstack/react-router";

import { loggedIn } from "@/middleware/auth";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeRoute,
  server: {
    middleware: [loggedIn],
  },
});

function HomeRoute() {
  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-8 text-xl font-bold">Home page</h1>

      <div className="flex items-center gap-4">
        <Button className="cursor-pointer" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button className="cursor-pointer" variant="outline" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}

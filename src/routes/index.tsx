import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { initialUsers } from "@/db/seed/data";
import { redirectIfAuthenticated } from "@/middleware/auth";

import { Button } from "@/components/ui/button";

const seedUsers = createServerFn().handler(async () => {
  try {
    const [u] = await db.select({ count: count() }).from(users);
    if (u.count < 1) {
      for await (const user of initialUsers) {
        await auth.api.signUpEmail({ body: user });
      }
    }
  } catch (error) {
    console.info("Failed to seed users.");
    throw error;
  }
});

export const Route = createFileRoute("/")({
  component: HomeRoute,
  server: {
    middleware: [redirectIfAuthenticated],
  },
  loader: async () => {
    await seedUsers();
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

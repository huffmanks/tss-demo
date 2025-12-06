import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { v7 as uuidv7 } from "uuid";

import { authClient } from "@/lib/auth-client";
import { todosCollection } from "@/lib/collections";
import { loggedOut } from "@/middleware/auth";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(protected)/dashboard")({
  ssr: false,
  component: DashboardRoute,
  server: {
    middleware: [loggedOut],
  },
});

function DashboardRoute() {
  const { data: session, isPending } = authClient.useSession();

  const { data: todos } = useLiveQuery((q) =>
    q.from({ todo: todosCollection }).orderBy(({ todo }) => todo.updatedAt, "desc")
  );

  async function handleCreateTodo() {
    const id = uuidv7();

    todosCollection.insert({
      id: id,
      title: "hello",
      userId: session?.user.id!,
    });
  }

  if (!session?.user || isPending) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Dashboard page</h1>

      <div className="mb-4 flex items-center gap-4">
        <Button onClick={handleCreateTodo}>Create a todo</Button>
      </div>

      {todos && todos.length > 0 && todos.map((todo) => <div key={todo.id}>{todo.title}</div>)}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { todos } from "@/db/schema";
import { auth } from "@/lib/auth";
import { json } from "@/lib/utils";

// Proxy-auth pattern based on ElectricSQL example
// Ref: https://github.com/electric-sql/electric/blob/main/examples/proxy-auth/app/shape-proxy/route.ts

export const Route = createFileRoute("/api/electric")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.id) {
          return json({ error: "Not authenticated" }, 401);
        }

        const userId = session.user.id;
        const url = new URL(request.url);

        const table = url.searchParams.get("table")?.trim();
        const allowedTables = ["todos"];

        if (!table || !allowedTables.includes(table)) {
          return json({ error: "Invalid or missing table." }, 400);
        }

        let whereSql: string;

        switch (table) {
          case "todos":
            const userTodos = await db
              .select({ id: todos.id })
              .from(todos)
              .where(eq(todos.userId, userId));

            if (userTodos.length === 0) {
              whereSql = `1 = 0`;
            } else {
              const todoIds = userTodos.map((wb) => `'${wb.id}'`).join(", ");
              whereSql = `"todoId" IN (${todoIds})`;
            }
            break;

          default:
            throw new Error("Invalid table");
        }

        const electricUrl = process.env.ELECTRIC_URL!;
        const upstreamUrl = new URL("/v1/shape", electricUrl);

        for (const [key, value] of url.searchParams.entries()) {
          if (key === "table") continue;
          upstreamUrl.searchParams.set(key, value);
        }

        upstreamUrl.searchParams.set("table", table);
        upstreamUrl.searchParams.set("where", whereSql);

        console.log("electric-proxy", {
          userId,
          table,
          where: whereSql,
          url: upstreamUrl.toString(),
        });

        try {
          const upstream = await fetch(upstreamUrl.toString(), {
            method: "GET",
          });

          const headers = new Headers(upstream.headers);

          headers.delete("access-control-allow-origin");
          headers.delete("access-control-allow-credentials");

          headers.set("Vary", "Cookie");

          return new Response(upstream.body, {
            status: upstream.status,
            headers,
          });
        } catch (error) {
          console.error("Electric proxy error:", error);
          return json({ error: "Failed to connect to Electric server" }, 502);
        }
      },
    },
  },
});

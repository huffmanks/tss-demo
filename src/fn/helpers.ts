import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { todos } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function authUser() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  const user = session?.user;
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function authTodo(todoId: string) {
  const user = await authUser();
  const todo = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)));

  if (!todo) {
    throw new Error("Todo not found or access denied");
  }
  return { user, todo };
}

type TxIdResultRow = {
  txid: number;
};

export async function getTxId() {
  const statement = sql`SELECT pg_current_xact_id()::xid::text::int as txid`;
  const result = await db.execute<TxIdResultRow>(statement);

  return result.rows[0]?.txid;
}

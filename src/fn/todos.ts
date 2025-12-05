import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { todoSchema } from "@/db/entities";
import { todos } from "@/db/schema";
import { authTodo, getTxId } from "@/fn/helpers";

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator(todoSchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [todo] = await tx.insert(todos).values(data).returning();
      const txid = await getTxId();

      return { todo, txid };
    });
  });

export const updateTodo = createServerFn({ method: "POST" })
  .inputValidator(
    todoSchema
      .pick({
        id: true,
        title: true,
        completed: true,
      })
      .partial({
        title: true,
        completed: true,
      })
  )
  .handler(async ({ data }) => {
    await authTodo(data.id);

    return await db.transaction(async (tx) => {
      const [todo] = await tx
        .update(todos)
        .set({ ...data })
        .where(eq(todos.id, data.id))
        .returning();
      const txid = await getTxId();

      return { todo, txid };
    });
  });

export const deleteTodo = createServerFn({ method: "POST" })
  .inputValidator(todoSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    await authTodo(data.id);

    return await db.transaction(async (tx) => {
      const [todo] = await tx.delete(todos).where(eq(todos.id, data.id)).returning();

      const txid = await getTxId();

      return { todo, txid };
    });
  });

import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categorySchema } from "@/db/entities";
import { categories } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(categorySchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [category] = await tx.insert(categories).values(data).returning();
      const txid = await getTxId();

      return { category, txid };
    });
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(
    categorySchema
      .pick({
        id: true,
        title: true,
        slug: true,
      })
      .partial({
        title: true,
        slug: true,
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [category] = await tx
        .update(categories)
        .set({ ...data })
        .where(eq(categories.id, data.id))
        .returning();
      const txid = await getTxId();

      return { category, txid };
    });
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator(categorySchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [category] = await tx.delete(categories).where(eq(categories.id, data.id)).returning();

      const txid = await getTxId();

      return { category, txid };
    });
  });

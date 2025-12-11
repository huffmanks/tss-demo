import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { diets } from "@/db/schema";
import { dietSchema } from "@/electric/entities";
import { getTxId } from "@/fn/helpers";

export const createDiet = createServerFn({ method: "POST" })
  .inputValidator(dietSchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [diet] = await tx.insert(diets).values(data).returning();
      const txid = await getTxId();

      return { diet, txid };
    });
  });

export const updateDiet = createServerFn({ method: "POST" })
  .inputValidator(
    dietSchema
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
      const [diet] = await tx
        .update(diets)
        .set({ ...data })
        .where(eq(diets.id, data.id))
        .returning();
      const txid = await getTxId();

      return { diet, txid };
    });
  });

export const deleteDiet = createServerFn({ method: "POST" })
  .inputValidator(dietSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [diet] = await tx.delete(diets).where(eq(diets.id, data.id)).returning();

      const txid = await getTxId();

      return { diet, txid };
    });
  });

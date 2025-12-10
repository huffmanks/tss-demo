import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cuisineSchema } from "@/db/entities";
import { cuisines } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createCuisine = createServerFn({ method: "POST" })
  .inputValidator(cuisineSchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [cuisine] = await tx.insert(cuisines).values(data).returning();
      const txid = await getTxId();

      return { cuisine, txid };
    });
  });

export const updateCuisine = createServerFn({ method: "POST" })
  .inputValidator(
    cuisineSchema
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
      const [cuisine] = await tx
        .update(cuisines)
        .set({ ...data })
        .where(eq(cuisines.id, data.id))
        .returning();
      const txid = await getTxId();

      return { cuisine, txid };
    });
  });

export const deleteCuisine = createServerFn({ method: "POST" })
  .inputValidator(cuisineSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [cuisine] = await tx.delete(cuisines).where(eq(cuisines.id, data.id)).returning();

      const txid = await getTxId();

      return { cuisine, txid };
    });
  });

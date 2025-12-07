import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ingredientSchema } from "@/db/entities";
import { ingredients } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createIngredient = createServerFn({ method: "POST" })
  .inputValidator(
    ingredientSchema
      .pick({
        recipeId: true,
        name: true,
        order: true,
      })
      .extend({
        amount: ingredientSchema.shape.amount.optional(),
        unit: ingredientSchema.shape.unit.optional(),
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [ingredient] = await tx.insert(ingredients).values(data).returning();
      const txid = await getTxId();

      return { ingredient, txid };
    });
  });

export const updateIngredient = createServerFn({ method: "POST" })
  .inputValidator(
    ingredientSchema
      .pick({
        id: true,
        recipeId: true,
        amount: true,
        unit: true,
        name: true,
        order: true,
      })
      .partial({
        recipeId: true,
        amount: true,
        unit: true,
        name: true,
        order: true,
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [ingredient] = await tx
        .update(ingredients)
        .set({ ...data })
        .where(eq(ingredients.id, data.id))
        .returning();
      const txid = await getTxId();

      return { ingredient, txid };
    });
  });

export const deleteIngredient = createServerFn({ method: "POST" })
  .inputValidator(ingredientSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [ingredient] = await tx
        .delete(ingredients)
        .where(eq(ingredients.id, data.id))
        .returning();

      const txid = await getTxId();

      return { ingredient, txid };
    });
  });

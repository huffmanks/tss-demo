import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { recipeSchema } from "@/db/entities";
import { recipes } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createRecipe = createServerFn({ method: "POST" })
  .inputValidator(
    recipeSchema
      .pick({
        title: true,
        slug: true,
        description: true,
        image: true,
        servingSize: true,
        userId: true,
        categoryId: true,
      })
      .extend({
        prepTime: recipeSchema.shape.prepTime.optional(),
        cookTime: recipeSchema.shape.prepTime.optional(),
        totalTime: recipeSchema.shape.prepTime.optional(),
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [recipe] = await tx.insert(recipes).values(data).returning();
      const txid = await getTxId();

      return { recipe, txid };
    });
  });

export const updateRecipe = createServerFn({ method: "POST" })
  .inputValidator(
    recipeSchema
      .pick({
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        servingSize: true,
        prepTime: true,
        cookTime: true,
        totalTime: true,
        userId: true,
        categoryId: true,
      })
      .partial({
        title: true,
        slug: true,
        description: true,
        image: true,
        servingSize: true,
        prepTime: true,
        cookTime: true,
        totalTime: true,
        userId: true,
        categoryId: true,
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [recipe] = await tx
        .update(recipes)
        .set({ ...data })
        .where(eq(recipes.id, data.id))
        .returning();
      const txid = await getTxId();

      return { recipe, txid };
    });
  });

export const deleteRecipe = createServerFn({ method: "POST" })
  .inputValidator(recipeSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [recipe] = await tx.delete(recipes).where(eq(recipes.id, data.id)).returning();

      const txid = await getTxId();

      return { recipe, txid };
    });
  });

import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { instructionSchema } from "@/db/entities";
import { instructions } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createInstruction = createServerFn({ method: "POST" })
  .inputValidator(
    instructionSchema.extend({
      isHeading: instructionSchema.shape.isHeading.optional(),
    })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [instruction] = await tx.insert(instructions).values(data).returning();
      const txid = await getTxId();

      return { instruction, txid };
    });
  });

export const updateInstruction = createServerFn({ method: "POST" })
  .inputValidator(
    instructionSchema
      .pick({
        id: true,
        recipeId: true,
        name: true,
        isHeading: true,
        order: true,
      })
      .partial({
        recipeId: true,
        name: true,
        isHeading: true,
        order: true,
      })
  )
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [instruction] = await tx
        .update(instructions)
        .set({ ...data })
        .where(eq(instructions.id, data.id))
        .returning();
      const txid = await getTxId();

      return { instruction, txid };
    });
  });

export const deleteInstruction = createServerFn({ method: "POST" })
  .inputValidator(instructionSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [instruction] = await tx
        .delete(instructions)
        .where(eq(instructions.id, data.id))
        .returning();

      const txid = await getTxId();

      return { instruction, txid };
    });
  });

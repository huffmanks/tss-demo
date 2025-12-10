import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tagSchema } from "@/db/entities";
import { tags } from "@/db/schema";
import { getTxId } from "@/fn/helpers";

export const createTag = createServerFn({ method: "POST" })
  .inputValidator(tagSchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [tag] = await tx.insert(tags).values(data).returning();
      const txid = await getTxId();

      return { tag, txid };
    });
  });

export const updateTag = createServerFn({ method: "POST" })
  .inputValidator(
    tagSchema
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
      const [tag] = await tx
        .update(tags)
        .set({ ...data })
        .where(eq(tags.id, data.id))
        .returning();
      const txid = await getTxId();

      return { tag, txid };
    });
  });

export const deleteTag = createServerFn({ method: "POST" })
  .inputValidator(tagSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [tag] = await tx.delete(tags).where(eq(tags.id, data.id)).returning();

      const txid = await getTxId();

      return { tag, txid };
    });
  });

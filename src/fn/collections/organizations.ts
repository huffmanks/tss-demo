import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { organizations } from "@/db/schema";

const getOrganizationByIdSchema = z.object({
  orgId: z.uuidv7(),
});

export const getOrganizationById = createServerFn()
  .inputValidator(getOrganizationByIdSchema)
  .handler(async ({ data }) => {
    return await db.select().from(organizations).where(eq(organizations.id, data.orgId));
  });

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export const authUser = createServerFn().handler(async () => {
  const headers = getRequestHeaders();

  const data = await auth.api.getSession({ headers });

  if (!data?.user) {
    throw new Error("Unauthorized");
  }

  return { user: data.user, session: data.session };
});

const setUserActiveOrganizationIdSchema = z.object({
  userId: z.uuidv7(),
  organizationId: z.uuidv7(),
});

export const setUserActiveOrganizationId = createServerFn()
  .inputValidator(setUserActiveOrganizationIdSchema)
  .handler(async ({ data }) => {
    await db
      .update(users)
      .set({ activeOrganizationId: data.organizationId })
      .where(eq(users.id, data.userId));

    return true;
  });

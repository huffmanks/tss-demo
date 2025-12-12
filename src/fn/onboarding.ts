import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { createOrgSchema } from "@/electric/entities";

export const doesOrgExist = createServerFn().handler(async () => {
  const [o] = await db.select({ count: count() }).from(organizations);
  return o.count > 0;
});

export const createFirstOrg = createServerFn({ method: "POST" })
  .inputValidator(createOrgSchema)
  .handler(async ({ data }) => {
    const { name, slug, userId } = data;

    return await auth.api.createOrganization({
      body: {
        name,
        slug,
        userId,
        keepCurrentActiveOrganization: false,
      },
    });
  });

import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";

import { db } from "@/db";
import { organizations } from "@/db/schema";

export const doesOrgExist = createServerFn().handler(async () => {
  const [o] = await db.select({ count: count() }).from(organizations);
  return o.count > 0;
});

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";

export const authUser = createServerFn().handler(async () => {
  const headers = getRequestHeaders();

  const data = await auth.api.getSession({ headers });

  if (!data?.user) {
    throw new Error("Unauthorized");
  }

  return { user: data.user, session: data.session };
});

export const checkAdminStatus = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) return { role: "none" };
  return { role: session.user.role };
});

const setActiveOrganizationSchema = z.object({
  email: z.email(),
});

export const setActiveOrganization = createServerFn()
  .inputValidator(setActiveOrganizationSchema)
  .handler(async ({ data }) => {
    const [user] = await db
      .select({ activeOrganizationId: users.activeOrganizationId })
      .from(users)
      .where(eq(users.email, data.email));

    if (!user.activeOrganizationId) return;

    const organizationId = user.activeOrganizationId;

    const [organization] = await db
      .select({ slug: organizations.slug })
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    if (!organization.slug) return;

    return {
      organizationId,
      organizationSlug: organization.slug,
    };
  });

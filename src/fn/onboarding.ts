import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, cuisines, diets, organizations, units, users } from "@/db/schema";
import { initialCategories, initialCuisines, initialDiets, initialUnits } from "@/db/seed/data";
import { restrictInitialSetupMiddleware } from "@/middleware/auth";

export const doesUserExist = createServerFn().handler(async () => {
  const result = await db.select({ id: users.id }).from(users).limit(1);

  return result.length > 0;
});

const setupAdminUserOrganizationSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  organizationName: z.string(),
  organizationSlug: z.string(),
});

export const setupAdminUserOrganization = createServerFn()
  .inputValidator(setupAdminUserOrganizationSchema)
  .middleware([restrictInitialSetupMiddleware])
  .handler(async ({ data }) => {
    const userExists = await doesUserExist();
    if (userExists) throw new Error("INITIAL_SIGNUP_ALREADY_COMPLETE");

    let userId: string | undefined;
    let organizationId: string | undefined;

    try {
      const userResult = await auth.api.createUser({
        body: {
          ...data,
          role: "admin",
        },
      });

      userId = userResult.user.id;

      if (!userId) throw new Error("USER_CREATION_FAILED");

      const organizationResult = await auth.api.createOrganization({
        body: { name: data.organizationName, slug: data.organizationSlug, userId },
      });

      if (!organizationResult?.id) throw new Error("ORG_CREATION_FAILED");

      organizationId = organizationResult.id;
      const safeUserId = userId;
      const safeOrgId = organizationId;

      await db.transaction(async (tx) => {
        await tx
          .insert(categories)
          .values(initialCategories.map((cat) => ({ ...cat, organizationId: safeOrgId })));
        await tx
          .insert(cuisines)
          .values(initialCuisines.map((cat) => ({ ...cat, organizationId: safeOrgId })));
        await tx
          .insert(diets)
          .values(initialDiets.map((cat) => ({ ...cat, organizationId: safeOrgId })));
        await tx
          .insert(units)
          .values(initialUnits.map((cat) => ({ ...cat, organizationId: safeOrgId })));

        await tx
          .update(users)
          .set({ activeOrganizationId: organizationId })
          .where(eq(users.id, safeUserId));
      });

      return { success: true, userId, organizationId };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (userId) {
          await db.delete(users).where(eq(users.id, userId));
        }

        if (organizationId) {
          await db.delete(organizations).where(eq(organizations.id, organizationId));
        }

        throw new Error(error.message);
      }

      throw new Error("UNKNOWN_ERROR");
    }
  });

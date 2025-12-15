import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { count } from "drizzle-orm";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, cuisines, diets, units, users } from "@/db/schema";
import { initialCategories, initialCuisines, initialDiets, initialUnits } from "@/db/seed/data";

export const doesUserExist = createServerFn().handler(async () => {
  const [user] = await db.select({ count: count() }).from(users);
  return user.count > 0;
});

const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const createAdminUser = createServerFn()
  .inputValidator(createUserSchema)
  .handler(async ({ data }) => {
    return await auth.api.createUser({
      body: {
        ...data,
        role: "admin",
      },
    });
  });

const createOrganizationSchema = z.object({
  organizationName: z.string(),
  organizationSlug: z.string(),
  userId: z.uuidv7(),
});

export const createFirstOrganization = createServerFn()
  .inputValidator(createOrganizationSchema)
  .handler(async ({ data }) => {
    const organization = await auth.api.createOrganization({
      body: {
        name: data.organizationName,
        slug: data.organizationSlug,
        userId: data.userId,
      },
    });

    if (!organization) return null;

    const headers = getRequestHeaders();

    await auth.api.addMember({
      body: {
        userId: data.userId,
        role: "owner",
        organizationId: organization.id,
      },
    });

    await auth.api.setActiveOrganization({
      body: {
        organizationId: organization.id,
        organizationSlug: organization.slug,
      },
      headers,
    });

    return organization;
  });

const seedNewOrganizationSchema = z.object({
  organizationId: z.uuidv7(),
});

export const seedNewOrganizationData = createServerFn()
  .inputValidator(seedNewOrganizationSchema)
  .handler(async ({ data }) => {
    try {
      const organizationId = data.organizationId;
      for await (const category of initialCategories) {
        await db.insert(categories).values({ ...category, organizationId });
      }

      for await (const cuisine of initialCuisines) {
        await db.insert(cuisines).values({ ...cuisine, organizationId });
      }

      for await (const diet of initialDiets) {
        await db.insert(diets).values({ ...diet, organizationId });
      }

      for await (const unit of initialUnits) {
        await db.insert(units).values({ ...unit, organizationId });
      }
    } catch (error) {
      console.info("Failed to seed new organization data.");
      throw error;
    }
  });

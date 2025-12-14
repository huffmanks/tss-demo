import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { count } from "drizzle-orm";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, cuisines, diets, organizations, units, users } from "@/db/schema";
import { initialCategories, initialCuisines, initialDiets, initialUnits } from "@/db/seed/data";

export const doesUserExist = createServerFn().handler(async () => {
  const [user] = await db.select({ count: count() }).from(users);
  return user.count > 0;
});

export const doesOrganizationExist = createServerFn().handler(async () => {
  const [organization] = await db.select({ count: count() }).from(organizations);
  return organization.count > 0;
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

export const createUser = createServerFn()
  .inputValidator(createUserSchema)
  .handler(async ({ data }) => {
    return await auth.api.createUser({
      body: {
        ...data,
        role: "user",
      },
    });
  });

const createOrgSchema = z.object({
  orgName: z.string(),
  teamName: z.string(),
  orgSlug: z.string(),
  teamSlug: z.string(),
  userId: z.uuidv7(),
});

export const createFirstOrgTeam = createServerFn()
  .inputValidator(createOrgSchema)
  .handler(async ({ data }) => {
    const organization = await auth.api.createOrganization({
      body: {
        name: data.orgName,
        slug: data.orgSlug,
        userId: data.userId,
      },
    });

    if (!organization) return null;

    const headers = getRequestHeaders();

    await auth.api.setActiveOrganization({
      body: {
        organizationId: organization.id,
        organizationSlug: organization.slug,
      },
      headers,
    });

    const team = await auth.api.createTeam({
      body: {
        name: data.teamName,
        slug: data.teamSlug,
        organizationId: organization.id,
      },
    });

    await auth.api.setActiveTeam({
      body: {
        teamId: team.id,
      },
      headers,
    });

    await auth.api.addMember({
      body: {
        userId: data.userId,
        role: "owner",
        organizationId: organization.id,
        teamId: team.id,
      },
    });

    return { organization, team };
  });

const seedNewTeamSchema = z.object({
  teamId: z.uuidv7(),
});

export const seedNewTeamData = createServerFn()
  .inputValidator(seedNewTeamSchema)
  .handler(async ({ data }) => {
    try {
      const teamId = data.teamId;
      for await (const category of initialCategories) {
        await db.insert(categories).values({ ...category, teamId });
      }

      for await (const cuisine of initialCuisines) {
        await db.insert(cuisines).values({ ...cuisine, teamId });
      }

      for await (const diet of initialDiets) {
        await db.insert(diets).values({ ...diet, teamId });
      }

      for await (const unit of initialUnits) {
        await db.insert(units).values({ ...unit, teamId });
      }
    } catch (error) {
      console.info("Failed to seed new team data.");
      throw error;
    }
  });

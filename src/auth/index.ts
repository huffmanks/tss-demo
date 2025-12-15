import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  organization as organizationPlugin,
  twoFactor,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { seedNewOrganizationData } from "@/fn/onboarding";
import { siteConfig } from "@/lib/site-config";

export const auth = betterAuth({
  appName: siteConfig.title,
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [previousSession] = await db
            .select()
            .from(schema.sessions)
            .where(eq(schema.sessions.userId, session.userId));

          const activeOrganizationId = previousSession.activeOrganizationId;

          return {
            data: {
              ...session,
              activeOrganizationId: activeOrganizationId ?? null,
            },
          };
        },
      },
    },
  },
  plugins: [
    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    passkey(),
    twoFactor(),
    organizationPlugin({
      allowUserToCreateOrganization: (user) => {
        return user.role === "admin";
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization, user }) => {
          await auth.api.addMember({
            body: {
              userId: user.id,
              role: ["owner"],
              organizationId: organization.id,
            },
          });
        },
        afterCreateOrganization: async ({ organization }) => {
          await seedNewOrganizationData({ data: { organizationId: organization.id } });
        },
      },
    }),
    tanstackStartCookies(),
  ],
});

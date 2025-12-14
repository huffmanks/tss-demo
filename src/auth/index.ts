import { passkey } from "@better-auth/passkey";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  organization as organizationPlugin,
  twoFactor,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { ac, member, owner } from "@/auth/permissions";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { seedNewTeamData } from "@/fn/onboarding";
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
  plugins: [
    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    passkey(),
    twoFactor(),
    organizationPlugin({
      teams: {
        enabled: true,
      },
      schema: {
        team: {
          additionalFields: {
            slug: {
              fieldName: "slug",
              type: "string",
              required: true,
              input: true,
            },
          },
        },
      },
      ac,
      roles: {
        member,
        owner,
      },
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
        beforeCreateTeam: async ({ team, user }) => {
          const headers = getRequestHeaders();
          await auth.api.addTeamMember({
            body: {
              userId: user?.id,
              teamId: team.id,
            },
            headers,
          });
        },
        afterCreateTeam: async ({ team }) => {
          await seedNewTeamData({ data: { teamId: team.id } });
        },
      },
    }),
    tanstackStartCookies(),
  ],
});

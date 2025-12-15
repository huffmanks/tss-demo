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
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        required: false,
        input: false,
        references: {
          model: "organizations",
          field: "id",
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
          await auth.api.setActiveOrganization({
            body: {
              organizationId: organization.id,
              organizationSlug: organization.slug,
            },
            headers: getRequestHeaders(),
          });
        },
      },
    }),
    tanstackStartCookies(),
  ],
});

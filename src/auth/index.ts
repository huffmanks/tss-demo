import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, organization, twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { ac, member, owner } from "@/auth/permissions";
import { db } from "@/db";
import * as schema from "@/db/schema";
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
    organization({
      teams: {
        enabled: true,
      },
      ac,
      roles: {
        member,
        owner,
      },
      allowUserToCreateOrganization: (user) => {
        // const [firstUser] = await db
        //   .select()
        //   .from(schema.users)
        //   .where(eq(schema.users.id, user.id))
        //   .orderBy(asc(schema.users.createdAt))
        //   .limit(1);
        // return user.id === firstUser.id;
        return user.role === "admin";
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization: org, user }) => {
          await auth.api.addMember({
            body: {
              userId: user.id,
              role: ["owner"],
              organizationId: org.id,
            },
          });
        },
      },
    }),
    tanstackStartCookies(),
  ],
});

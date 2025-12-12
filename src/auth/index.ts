import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { ac, admin, manager, member, owner } from "@/auth/permissions";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  plugins: [
    organization({
      ac,
      roles: {
        member,
        manager,
        owner,
        admin,
      },
      // allowUserToCreateOrganization: async ({}) => {

      //   user.
      //   const subscription = await getSubscription(user.id);
      //   return subscription.plan === "pro";
      // },
      organizationHooks: {
        afterCreateOrganization: async ({ organization: org, user }) => {
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
  advanced: {
    database: {
      generateId: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
});

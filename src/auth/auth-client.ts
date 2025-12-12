import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, admin, manager, member, owner } from "@/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    organizationClient({
      ac,
      roles: {
        member,
        manager,
        owner,
        admin,
      },
    }),
  ],
});

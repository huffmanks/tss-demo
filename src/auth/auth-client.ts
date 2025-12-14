import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, organizationClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, member, owner } from "@/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    adminClient(),
    passkeyClient(),
    twoFactorClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
      ac,
      roles: {
        member,
        owner,
      },
    }),
  ],
});

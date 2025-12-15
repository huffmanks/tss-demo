import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  customSessionClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    adminClient(),
    passkeyClient(),
    twoFactorClient(),
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});

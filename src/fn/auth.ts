import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "@/auth";

export const authUser = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return { user: session.user, orgId: session.session.activeOrganizationId };
});

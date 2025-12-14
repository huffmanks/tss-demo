import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "@/auth";

export const authUser = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const data = await auth.api.getSession({ headers });

  if (!data?.user) {
    throw new Error("Unauthorized");
  }

  return { user: data.user, session: data.session };
});

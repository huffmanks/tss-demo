import { notFound, redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { auth } from "@/auth";
import { doesUserExist } from "@/fn/onboarding";

export const redirectIfAuthenticatedMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (session) {
      throw redirect({ to: "/dashboard", replace: true });
    }

    return next({
      context: {
        session,
      },
    });
  }
);

export const restrictInitialSetupMiddleware = createMiddleware().server(async ({ next }) => {
  const userExist = await doesUserExist();

  if (userExist) {
    throw notFound();
  }

  return await next();
});

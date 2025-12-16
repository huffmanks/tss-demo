import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { auth } from "@/auth";
import { doesUserExist } from "@/fn/onboarding";

export const redirectIfAuthenticated = createMiddleware().server(async ({ next, request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) {
    throw redirect({ to: "/dashboard", replace: true });
  }

  return await next();
});

export const restrictToInitialSetup = createMiddleware().server(async ({ next }) => {
  const userExist = await doesUserExist();

  if (userExist) {
    throw new Error("INITIAL_SIGNUP_ALREADY_COMPLETE:");
  }

  return await next();
});

import type { authClient } from "./auth/auth-client";

export type AuthUser = typeof authClient.$Infer.Session.user;

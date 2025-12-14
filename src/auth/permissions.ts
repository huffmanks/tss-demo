import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  organization: ["read", "update", "delete"],
  users: ["create", "read", "delete"],
  invitations: ["create", "read", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  organization: ["read"],
  users: ["read"],
  invitations: ["read", "delete"],
});

export const owner = ac.newRole({
  organization: ["read", "update", "delete"],
  users: ["create", "read", "delete"],
  invitations: ["create", "read", "delete"],
});

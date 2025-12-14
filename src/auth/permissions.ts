import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  organization: ["read", "update", "delete"],
  team: ["read", "update", "delete"],
  user: ["create", "read", "delete"],
  invitation: ["create", "read", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  organization: ["read"],
  team: ["read"],
  user: ["read"],
  invitation: ["read", "delete"],
});

export const owner = ac.newRole({
  organization: ["read", "update", "delete"],
  team: ["read", "update", "delete"],
  user: ["create", "read", "delete"],
  invitation: ["create", "read", "delete"],
});

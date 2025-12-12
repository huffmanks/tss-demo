import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  organization: ["create", "read", "update", "delete"],
  entity: ["create", "read", "share", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  invitations: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  organization: ["read"],
  entity: ["create", "read", "share", "update"],
  users: ["read"],
  invitations: ["read"],
});

export const manager = ac.newRole({
  organization: ["read", "update"],
  entity: ["create", "read", "share", "update", "delete"],
  users: ["create", "read"],
  invitations: ["create", "read", "update", "delete"],
});

export const owner = ac.newRole({
  organization: ["read", "update", "delete"],
  entity: ["create", "read", "share", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  invitations: ["create", "read", "update", "delete"],
});

export const admin = ac.newRole({
  organization: ["create", "read", "update", "delete"],
  entity: ["create", "read", "share", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  invitations: ["create", "read", "update", "delete"],
});

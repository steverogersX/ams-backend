import { relations } from 'drizzle-orm';
import { societies } from './societies';
import { users } from './users';
import { roles } from './roles';
import { rolePermissions } from './role-permissions';
import { userRoles } from './user-roles';
import { sessions } from './sessions';

/**
 * Drizzle relation metadata for typed, ergonomic joins (e.g. `db.query.roles.findMany({ with: ... })`).
 * These describe relationships for the query layer only — the actual foreign keys are declared on the
 * table definitions.
 */

export const societiesRelations = relations(societies, ({ many }) => ({
  roles: many(roles),
}));

export const usersRelations = relations(users, ({ many }) => ({
  // `user_roles` references `users` twice (the holder and the granter), so each side must be
  // disambiguated with a matching `relationName`.
  userRoles: many(userRoles, { relationName: 'roleHolder' }),
  assignedUserRoles: many(userRoles, { relationName: 'roleGranter' }),
  sessions: many(sessions),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  society: one(societies, { fields: [roles.societyId], references: [societies.id] }),
  permissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
    relationName: 'roleHolder',
  }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
  assignedByUser: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.id],
    relationName: 'roleGranter',
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

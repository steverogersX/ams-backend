import { Router } from 'express';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/authenticate';
import { requirePermission } from '@/middlewares/requirePermission';
import { Permission } from '@shared/index';
import {
  roleParamSchema,
  roleIdParamSchema,
  createRoleSchema,
  updateRoleSchema,
} from './role.schema';
import { listRoles, getRole, createRole, updateRole, deleteRole } from './role.controller';

export const roleRouter = Router();

roleRouter.get(
  '/:societyId/roles',
  authenticate,
  requirePermission(Permission.RolesView),
  validate(roleParamSchema),
  listRoles,
);
roleRouter.get(
  '/:societyId/roles/:roleId',
  authenticate,
  requirePermission(Permission.RolesView),
  validate(roleIdParamSchema),
  getRole,
);
roleRouter.post(
  '/:societyId/roles',
  authenticate,
  requirePermission(Permission.RolesCreate),
  validate(createRoleSchema),
  createRole,
);
roleRouter.put(
  '/:societyId/roles/:roleId',
  authenticate,
  requirePermission(Permission.RolesUpdate),
  validate(updateRoleSchema),
  updateRole,
);
roleRouter.delete(
  '/:societyId/roles/:roleId',
  authenticate,
  requirePermission(Permission.RolesDelete),
  validate(roleIdParamSchema),
  deleteRole,
);

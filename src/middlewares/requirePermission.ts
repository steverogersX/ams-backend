import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '@/utils/ApiError';
import type { PermissionDefinition } from '@/module/rbac/permission.definition';

export function requirePermission(permission: PermissionDefinition): RequestHandler {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    const ctx = _req.context;
    if (!ctx) {
      next(
        ApiError.internal('Request context missing — place authenticate before requirePermission'),
      );
      return;
    }

    if (ctx.isSuperAdmin) {
      next();
      return;
    }

    if (!ctx.societyId) {
      next(ApiError.forbidden('Society context required'));
      return;
    }

    if (!ctx.permissions.has(permission.name)) {
      next(ApiError.forbidden());
      return;
    }

    next();
  };
}

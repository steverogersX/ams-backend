import type { PermissionKey } from './permission.registry';

/** Wire-contract types for the roles API — shared so the frontend's API client and the
 * backend's responses can never drift out of shape. */

export interface RoleResponse {
  id: string;
  societyId: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: PermissionKey[];
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

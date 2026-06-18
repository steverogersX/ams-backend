import type { PermissionKey } from './permission.registry';

/**
 * Wire-contract types for the auth API — shared so the frontend's API client and the
 * backend's responses can never drift out of shape.
 */

export interface RegisterResponse {
  id: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
}

export interface SocietyMembership {
  societyId: string;
  societyName: string;
  societyToken: string;
  roles: string[];
  permissions: PermissionKey[];
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string | null;
    displayName: string | null;
    isSuperAdmin: boolean;
  };
  societies: SocietyMembership[];
}

export interface MeResponse {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  societyId: string | null;
  roles: string[];
  permissions: PermissionKey[];
}

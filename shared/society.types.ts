/** Wire-contract types for the society/platform API — shared so the platform UI's client and the
 * backend's responses can never drift out of shape. */

export interface SocietyResponse {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MemberResponse {
  userId: string;
  email: string | null;
  displayName: string | null;
  roleId: string;
  roleName: string;
  assignedAt: Date;
}

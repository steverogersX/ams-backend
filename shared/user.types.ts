/**
 * Wire-contract type for the create-user API — shared so the frontend's API client and the
 * backend's response can never drift out of shape.
 */
export interface UserResponse {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  isActive: boolean;
  roleIds: string[];
  createdAt: Date;
}

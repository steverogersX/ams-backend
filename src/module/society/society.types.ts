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

export interface RequestContext {
  userId: string;
  isSuperAdmin: boolean;
  societyId: string | null;
  permissions: ReadonlySet<string>;
}

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
}

export interface RequestContext {
  userId: string;
  isSuperAdmin: boolean;
  societyId: string | null;
  permissions: ReadonlySet<string>;
}

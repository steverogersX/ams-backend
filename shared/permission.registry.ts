import { PermissionDefinition } from './permission.definition';

/**
 * The single source of truth for every valid permission. Permissions are deny-by-default and
 * live only in code (never the database) — adding or changing one requires editing this file.
 *
 * Shared between backend and frontend: the backend enforces these via `requirePermission()`,
 * the frontend gates UI (nav items, buttons) against the same identifiers — one registry, no drift.
 */

const def = (name: string, domain: string, description: string): PermissionDefinition =>
  new PermissionDefinition(name, domain, description);

// Frozen so entries can only change through a code edit, never at runtime.
export const Permission = Object.freeze({
  VisitorApprove: def('visitor.approve', 'visitor', 'Approve a visitor'),
  VisitorDeny: def('visitor.deny', 'visitor', 'Deny a visitor'),
  VisitorLogEntry: def('visitor.log_entry', 'visitor', 'Log a gate entry'),
  VisitorViewHistory: def('visitor.view_history', 'visitor', 'View visitor history'),
  VisitorOverstayAlert: def('visitor.overstay_alert', 'visitor', 'Raise overstay alert'),
  BillingView: def('billing.view', 'billing', 'View bills'),
  BillingGenerate: def('billing.generate', 'billing', 'Generate a bill'),
  BillingApprove: def('billing.approve', 'billing', 'Approve a bill'),
  BillingWaive: def('billing.waive', 'billing', 'Waive a bill'),
  BillingExport: def('billing.export', 'billing', 'Export billing data'),
  ComplaintsRaise: def('complaints.raise', 'complaints', 'Raise a complaint'),
  ComplaintsAssign: def('complaints.assign', 'complaints', 'Assign a complaint'),
  ComplaintsResolve: def('complaints.resolve', 'complaints', 'Resolve a complaint'),
  ComplaintsEscalate: def('complaints.escalate', 'complaints', 'Escalate a complaint'),
  ComplaintsViewAll: def('complaints.view_all', 'complaints', 'View all complaints'),
  ResidentsView: def('residents.view', 'residents', 'View residents'),
  ResidentsAdd: def('residents.add', 'residents', 'Add a resident'),
  ResidentsRemove: def('residents.remove', 'residents', 'Remove a resident'),
  ResidentsUpdate: def('residents.update', 'residents', 'Update a resident'),
  NoticesPost: def('notices.post', 'notices', 'Post a notice'),
  NoticesDelete: def('notices.delete', 'notices', 'Delete a notice'),
  AmenitiesView: def('amenities.view', 'amenities', 'View amenities'),
  AmenitiesBook: def('amenities.book', 'amenities', 'Book an amenity'),
  AmenitiesManage: def('amenities.manage', 'amenities', 'Manage amenities'),
  StaffCheckin: def('staff.checkin', 'staff', 'Check in staff'),
  StaffCheckout: def('staff.checkout', 'staff', 'Check out staff'),
  StaffViewAttendance: def('staff.view_attendance', 'staff', 'View staff attendance'),
  StaffManage: def('staff.manage', 'staff', 'Manage staff'),
  RolesView: def('roles.view', 'roles', 'View roles'),
  RolesCreate: def('roles.create', 'roles', 'Create a role'),
  RolesAssign: def('roles.assign', 'roles', 'Assign a role'),
  RolesRevoke: def('roles.revoke', 'roles', 'Revoke a role'),
  RolesDelete: def('roles.delete', 'roles', 'Delete a role'),
  SocietySettingsView: def('society.settings.view', 'society', 'View society settings'),
  SocietySettingsUpdate: def('society.settings.update', 'society', 'Update society settings'),
});

export type PermissionKey = keyof typeof Permission;

export const ALL_PERMISSIONS: readonly PermissionDefinition[] = Object.values(Permission);

const PERMISSION_NAMES = new Set(ALL_PERMISSIONS.map((p) => p.name));

export function isValidPermission(name: string): boolean {
  return PERMISSION_NAMES.has(name);
}

const PERMISSION_KEY_BY_NAME: ReadonlyMap<string, PermissionKey> = new Map(
  (Object.entries(Permission) as [PermissionKey, PermissionDefinition][]).map(([key, p]) => [
    p.name,
    key,
  ]),
);

/** Maps a persisted dot-notation permission name (e.g. 'billing.generate') back to its typed key. */
export function permissionKeyFromName(name: string): PermissionKey | undefined {
  return PERMISSION_KEY_BY_NAME.get(name);
}

/**
 * A single, atomic permission declared in application code.
 *
 * Permissions are the lowest layer of the RBAC model. They are global (identical across every
 * society), defined only by engineers, and immutable at runtime. Each definition carries its
 * canonical `name` (the value persisted on roles), the `domain` it belongs to, and a human-readable
 * `description` used for tooling/documentation.
 */
export class PermissionDefinition {
  constructor(
    public readonly name: string, // 'billing.generate'
    public readonly domain: string, // 'billing'
    public readonly description: string,
  ) {}

  toString(): string {
    return this.name;
  }
}

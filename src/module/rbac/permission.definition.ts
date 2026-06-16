/**
 * The lowest layer of the RBAC model: global across societies, defined only in code,
 * and immutable at runtime. `name` is the canonical value persisted on roles.
 */
export class PermissionDefinition {
  constructor(
    public readonly name: string, // e.g. 'billing.generate' (domain.action)
    public readonly domain: string,
    public readonly description: string,
  ) {}

  toString(): string {
    return this.name;
  }
}

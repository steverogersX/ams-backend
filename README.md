# AMS Backend

**Apartment Management System** — Multi-tenant backend for managing apartment societies and their members.

Express 4 + TypeScript (CommonJS, strict). PostgreSQL via Drizzle ORM. Zod validation. Pino logging.

## Overview

AMS is a **multi-tenant** platform: one deployment hosts many independent **societies**, each with complete data isolation. Every society has its own roles, permissions, users, and resources. The platform enforces RBAC (Role-Based Access Control) at every layer.

- **Isolation**: Society data is structurally scoped; no cross-tenant data bleed.
- **Permissions**: Code-first RBAC with permission registry, role definitions, and user assignments.
- **Sessions**: Token-based auth with per-request society selection via header.

## Requirements

- Node.js 20+
- PostgreSQL 13+
- `.env` file with required variables (see `.env.example`)

## Setup

```bash
npm install
cp .env.example .env
# Update .env with your PostgreSQL connection string
npm run db:generate  # Generate initial migration
npm run dev          # Start the server
```

## Scripts

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `npm run dev`         | Start in watch mode (tsx)                             |
| `npm run build`       | Compile TypeScript to `dist/`                         |
| `npm start`           | Run the compiled build (production)                   |
| `npm run typecheck`   | Type-check without emitting; **must pass before git** |
| `npm run format`      | Format code with Prettier (2 spaces, single quotes)   |
| `npm run db:generate` | Generate a new migration from schema changes          |

**Note**: No test runner is configured. Use `npm run typecheck` for validation; create throwaway snippets with `npx tsx` as needed.

## Architecture

### Layered Module Structure

Each feature lives in `src/module/<name>/` with a consistent layer stack:

```
src/module/<name>/
  ├── <name>.routes.ts      # Express routes & middleware chain
  ├── <name>.controller.ts   # HTTP request/response handling (thin)
  ├── <name>.service.ts      # Business logic (thick)
  ├── <name>.schema.ts       # Zod validation schemas
  └── <name>.types.ts        # TypeScript types
```

- **Routes** define the endpoint and mount middleware (validation, auth checks).
- **Controllers** extract data, call services, return responses via `sendSuccess`/`sendError`.
- **Services** contain all business logic; exported as singletons.
- **Schemas** define Zod validators for request bodies, query params, etc.
- **Types** define TypeScript interfaces for domain entities.

### Database Layer

PostgreSQL + **Drizzle ORM** for type-safe queries.

- **Schema source of truth**: Tables are defined in `src/db/schema/` (one file per table, plus `relations.ts` and `index.ts`).
- **Migrations**: Generated from schema via `npm run db:generate`; never edit by hand.
- **Identifiers**: DB columns are `snake_case`; Drizzle symbols are `camelCase`.
- **Primary keys**: UUID (`defaultRandom()`); all time columns use `timestamptz`.

### RBAC (Role-Based Access Control)

Three-layer model:

1. **Permissions** (code only): Frozen registry in `src/module/rbac/permission.registry.ts`. Each permission is a typed constant (e.g., `Permission.BillingGenerate`).
2. **Roles** (database, society-scoped): Define which permissions are granted. Each role belongs to exactly one society.
3. **Assignments** (database): Map users to roles within a society. A user's effective permissions = union of all their roles in that society.

**Key rules**:

- Permissions are code-only; never stored in the database.
- Roles are always society-scoped; never global.
- Never check a role name in business logic; always check a permission.
- Deny by default: routes are inaccessible unless they explicitly require a permission.
- `super_admin` is a platform-level sentinel (not a society role).

### Middleware & Error Handling

- **Error handler** (`errorHandler.ts`): Catches all thrown errors and formats them into the API response.
- **Auth middleware** (`authenticate.ts`): Extracts and validates session tokens.
- **Permission middleware** (`requirePermission.ts`): Enforces permission checks.
- **Validation middleware** (`validate.ts`): Validates request body/query/params with Zod.
- **HTTP logging** (`httpLogger.ts`): Pino-based request/response logging.

Errors are **thrown**, not returned. Use `ApiError.*` (from `@/utils/ApiError`) for API failures:

```ts
throw ApiError.badRequest('Invalid input');
throw ApiError.unauthorized('Missing token');
throw ApiError.forbidden('Insufficient permissions');
throw ApiError.notFound('Resource not found');
throw ApiError.conflict('Duplicate entry');
throw ApiError.internal('Server error');
```

### Environment & Config

All environment variables are loaded and validated in `src/config/config.ts` via Zod. Access config only from that module; **never read `process.env` elsewhere**.

## API Conventions

### Response Envelope

Every endpoint returns a standard envelope:

```ts
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null; // null on error
  error: { message: string; code?: string; details?: unknown; stack?: string } | null; // null on success
  meta: { timestamp: string; [key: string]: unknown };
}
```

**Usage**:

```ts
// Success
sendSuccess(res, data, 'Resource created', StatusCodes.CREATED);

// Error (handled by error middleware)
throw ApiError.badRequest('Validation failed');
```

### Status Codes

Use `StatusCodes` from `http-status-codes` — never hardcoded numbers (e.g., `403`).

### Validation

Use Zod schemas + the `validate` middleware. No manual request parsing in controllers:

```ts
router.post('/', validate(createUserSchema), createUserController);
```

Validation errors are formatted with field-level details via `zod-validation-error`.

## Code Guidelines

### TypeScript

- **Strict mode enforced**: No `any`, no `@ts-ignore`, no non-null assertions (`!`).
- `npm run typecheck` **must pass** before every commit.

### Imports

- Use path alias `@/*` (resolves to `src/`) for internal imports.
- Never use long relative chains (`../../`).

### Controllers & Services

- **Controllers** are thin: extract data, call a service, return via `sendSuccess`/`sendError`.
- **Services** are thick: all business logic lives here.
- Wrap async controllers in `asyncHandler` so rejections reach the error handler.

### Naming

- Files: kebab-case with descriptors (e.g., `role-template.ts`, `item.controller.ts`).
- Classes & types: PascalCase.
- Functions & variables: camelCase.
- Run `npm run format` to enforce Prettier rules (single quotes, 2 spaces, 100 cols, semicolons).

## Git Workflow

### Conventional Commits

Enforced by commitlint:

```
type(scope): subject
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Rules**:

- Subject: lowercase, no trailing period, ≤ 100 chars.
- One logical change per commit.
- Never stage the whole tree blindly.

### Branch Naming

Enforced by pre-push hook:

```
<type>/<short-description>
```

Examples: `feat/rbac-permissions`, `fix/session-token-validation`, `release/1.0.0`, `hotfix/critical-bug`

Never commit feature work directly to `main`.

### Pre-commit Checks

Hooks enforce:

- Branch name validation
- Commitlint (message format)
- `npm run typecheck` (must pass)

**Never bypass hooks** with `--no-verify`. Fix the issue instead.

## Running the Server

**Development**:

```bash
npm run dev
```

Starts `src/index.ts` in watch mode with tsx. The server listens on the port defined in `.env`.

**Production**:

```bash
npm run build    # Compile to dist/
npm start        # Run dist/index.js
```

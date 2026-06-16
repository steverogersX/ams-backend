# ams-backend

Express + TypeScript backend.

## Requirements

- Node.js 20+

## Setup

```bash
npm install
cp .env.example .env
```

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start in watch mode (tsx)     |
| `npm run build`     | Compile TypeScript to `dist/` |
| `npm start`         | Run the compiled build        |
| `npm run typecheck` | Type-check without emitting   |

## Structure

```
src/
  config/        Environment loading and validation
  middlewares/   Error handling, 404, request validation
  module/        Feature modules (e.g. rbac: permissions, role templates)
  modules/       Feature modules (routes, controller, service, schema, types)
    health/
  routes/        API route aggregation
  utils/         Logger, ApiError, ApiResponse, asyncHandler
  app.ts         Express app factory
  index.ts       Server bootstrap and graceful shutdown
```

## API

Base path: `/api/v1`

| Method | Path      | Description    |
| ------ | --------- | -------------- |
| GET    | `/health` | Service health |

## Response shape

Every endpoint returns the same envelope, defined in
[`src/utils/ApiResponse.ts`](src/utils/ApiResponse.ts). Use `sendSuccess` and
`sendError` to emit it.

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

- Status codes come from [`http-status-codes`](https://www.npmjs.com/package/http-status-codes)
  (`StatusCodes`) — no hardcoded numbers.
- Zod validation failures are turned into readable messages via
  [`zod-validation-error`](https://www.npmjs.com/package/zod-validation-error)
  (`fromZodError`), with field-level errors preserved in `error.details`.

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
  modules/       Feature modules (routes, controller, service, schema, types)
    health/
    items/
  routes/        API route aggregation
  utils/         Logger, ApiError, asyncHandler
  app.ts         Express app factory
  index.ts       Server bootstrap and graceful shutdown
```

## API

Base path: `/api/v1`

| Method | Path         | Description    |
| ------ | ------------ | -------------- |
| GET    | `/health`    | Service health |
| GET    | `/items`     | List items     |
| POST   | `/items`     | Create an item |
| GET    | `/items/:id` | Get an item    |
| PATCH  | `/items/:id` | Update an item |
| DELETE | `/items/:id` | Delete an item |

All responses follow `{ success, data }` or `{ success, error }`.

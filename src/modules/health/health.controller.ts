import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { env } from '@/config/env';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

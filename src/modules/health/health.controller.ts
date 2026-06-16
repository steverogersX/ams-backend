import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { config } from '@/config';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      environment: config.env,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

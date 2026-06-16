import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/ApiResponse';
import { config } from '@/config';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'ok',
      environment: config.env,
      uptime: process.uptime(),
    },
    { message: 'Service is healthy' },
  );
});

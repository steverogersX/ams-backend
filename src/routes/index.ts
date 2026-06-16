import { Router } from 'express';
import { authRouter } from '@/module/auth/auth.routes';
import { societyRouter } from '@/module/society/society.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/societies', societyRouter);

export { router as apiRoutes };

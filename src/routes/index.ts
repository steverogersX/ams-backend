import { Router } from 'express';
import { healthRoutes } from '@/modules/health/health.routes';
import { itemRoutes } from '@/modules/items/item.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);

export { router as apiRoutes };

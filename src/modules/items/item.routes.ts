import { Router } from 'express';
import { validate } from '@/middlewares/validate';
import { createItem, deleteItem, getItem, listItems, updateItem } from './item.controller';
import { createItemSchema, itemIdSchema, updateItemSchema } from './item.schema';

const router = Router();

router.get('/', listItems);
router.post('/', validate(createItemSchema), createItem);
router.get('/:id', validate(itemIdSchema), getItem);
router.patch('/:id', validate(updateItemSchema), updateItem);
router.delete('/:id', validate(itemIdSchema), deleteItem);

export { router as itemRoutes };

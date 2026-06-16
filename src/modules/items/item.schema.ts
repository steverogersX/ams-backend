import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required').max(120),
    description: z.string().max(1000).optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
  }),
});

export const itemIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

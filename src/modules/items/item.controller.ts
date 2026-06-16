import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { itemService } from './item.service';

export const listItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await itemService.findAll();
  res.status(200).json({ success: true, data: items });
});

export const getItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemService.findById(req.params.id);
  res.status(200).json({ success: true, data: item });
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemService.create(req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemService.update(req.params.id, req.body);
  res.status(200).json({ success: true, data: item });
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  await itemService.remove(req.params.id);
  res.status(204).send();
});

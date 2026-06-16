import { randomUUID } from 'node:crypto';
import { ApiError } from '@/utils/ApiError';
import type { CreateItemInput, Item, UpdateItemInput } from './item.types';

class ItemService {
  private readonly items = new Map<string, Item>();

  async findAll(): Promise<Item[]> {
    return [...this.items.values()];
  }

  async findById(id: string): Promise<Item> {
    const item = this.items.get(id);
    if (!item) {
      throw ApiError.notFound(`Item ${id} not found`);
    }
    return item;
  }

  async create(input: CreateItemInput): Promise<Item> {
    const item: Item = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      createdAt: new Date().toISOString(),
    };
    this.items.set(item.id, item);
    return item;
  }

  async update(id: string, input: UpdateItemInput): Promise<Item> {
    const existing = await this.findById(id);
    const updated: Item = { ...existing, ...input };
    this.items.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!this.items.delete(id)) {
      throw ApiError.notFound(`Item ${id} not found`);
    }
  }
}

export const itemService = new ItemService();

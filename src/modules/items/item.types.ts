export interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export type CreateItemInput = Pick<Item, 'name' | 'description'>;
export type UpdateItemInput = Partial<CreateItemInput>;

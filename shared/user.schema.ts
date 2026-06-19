import { z } from 'zod';

/**
 * Single source of truth for the "create user" payload shape — imported by the UI's
 * TanStack Form (client-side validation) and by the backend's `validate(schema)` middleware
 * (server-side validation), so the two can never drift out of shape.
 *
 * `flatNumber` and `occupation` are not backed by any DB column yet (no `occupation` column on
 * `users`) — they validate today for the UI-only form.
 */

export const vehicleSchema = z.object({
  registrationNumber: z.string().trim().min(1, 'Registration number is required').max(20),
  type: z.enum(['car', 'two_wheeler']),
  make: z.string().trim().max(40).optional(),
  model: z.string().trim().max(40).optional(),
  color: z.string().trim().max(30).optional(),
  parkingSlot: z.string().trim().max(20).optional(),
});

export const createUserBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().max(20).optional(),
  flatNumber: z.string().trim().max(20).optional(),
  occupation: z.string().trim().max(80).optional(),
  vehicles: z.array(vehicleSchema),
  roleIds: z.array(z.string().uuid('Invalid role ID')).min(1, 'Select at least one role'),
});

export const editUserBodySchema = createUserBodySchema.omit({ email: true });

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type EditUserBody = z.infer<typeof editUserBodySchema>;

import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  points: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export const UpdatePointsSchema = z.object({
  userId: z.string(),
  points: z.number(),
});

// Response Types
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdatePointsInput = z.infer<typeof UpdatePointsSchema>; 
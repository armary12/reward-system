import { z } from 'zod';

// Reward Schema
export const RewardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  pointsCost: z.number(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Redemption Transaction Schema
export const RedemptionTransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rewardId: z.string(),
  pointsSpent: z.number(),
  status: z.string(),
  createdAt: z.date(),
  qrCodeDataUrl: z.string(),
  shortCode: z.string(),
});

// Input Schemas
export const CreateRewardSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  pointsCost: z.number(),
  imageUrl: z.string().optional(),
});

export const RedeemRewardSchema = z.object({
  userId: z.string(),
  rewardId: z.string(),
});

// Response Types
export type Reward = z.infer<typeof RewardSchema>;
export type RedemptionTransaction = z.infer<typeof RedemptionTransactionSchema>;
export type CreateRewardInput = z.infer<typeof CreateRewardSchema>;
export type RedeemRewardInput = z.infer<typeof RedeemRewardSchema>; 
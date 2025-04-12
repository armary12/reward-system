import { z } from 'zod';

// QR Code Generation Response Schema
export const QrCodeResponseSchema = z.object({
  qrCodeDataUrl: z.string(),
  shortCode: z.string(),
});

// Validation Response Schema
export const ValidationResponseSchema = z.object({
  success: z.boolean(),
  userId: z.string().optional(),
  pointsEarned: z.number().optional(),
  message: z.string().optional(),
  userName: z.string().optional(),
});

export const RewardValidationResponseSchema = z.object({
  success: z.boolean(),
  redemptionId: z.string().optional(),
  userId: z.string().optional(),
  rewardId: z.string().optional(),
  message: z.string().optional(),
});

// Input Schemas for Procedures
export const GenerateQrCodeSchema = z.object({
  userId: z.string(),
});

export const GenerateRewardQrCodeSchema = z.object({
  userId: z.string(),
  rewardId: z.string(),
});

export const ValidateCodeSchema = z.object({
  code: z.string(),
  amountToAdd: z.number(),
  type: z.enum(['qr', 'short']),
});

export const ValidateRewardCodeSchema = z.object({
  code: z.string(),
});

// Response Types
export type QrCodeResponse = z.infer<typeof QrCodeResponseSchema>;
export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
export type RewardValidationResponse = z.infer<typeof RewardValidationResponseSchema>; 
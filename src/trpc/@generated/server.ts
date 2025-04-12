import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  userRouter: t.router({
    findAll: publicProcedure.output(z.array(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findOne: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string(),
    })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      id: z.string(),
      data: z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
      }),
    })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    remove: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updatePoints: publicProcedure.input(z.object({
      userId: z.string(),
      points: z.number(),
    })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    addPoints: publicProcedure.input(z.object({
      userId: z.string(),
      points: z.number(),
    })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      points: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  qrCodeRouter: t.router({
    generateUserQrCode: publicProcedure.input(z.object({
      userId: z.string(),
    })).output(z.object({
      qrCodeDataUrl: z.string(),
      shortCode: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    generateRewardQrcode: publicProcedure.input(z.object({
      userId: z.string(),
      rewardId: z.string(),
    })).output(z.object({
      qrCodeDataUrl: z.string(),
      shortCode: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    validateCode: publicProcedure.input(z.object({
      code: z.string(),
      amountToAdd: z.number(),
      type: z.enum(['qr', 'short']),
    })).output(z.object({
      success: z.boolean(),
      userId: z.string().optional(),
      pointsEarned: z.number().optional(),
      message: z.string().optional(),
      userName: z.string().optional(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    validateRewardCode: publicProcedure.input(z.object({
      code: z.string(),
    })).output(z.object({
      success: z.boolean(),
      redemptionId: z.string().optional(),
      userId: z.string().optional(),
      rewardId: z.string().optional(),
      message: z.string().optional(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  rewardRouter: t.router({
    findAllRewards: publicProcedure.output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      pointsCost: z.number(),
      imageUrl: z.string().nullable(),
      isActive: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findRewardById: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      pointsCost: z.number(),
      imageUrl: z.string().nullable(),
      isActive: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAvailableRewardsForUser: publicProcedure.input(z.object({ userId: z.string() })).output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      pointsCost: z.number(),
      imageUrl: z.string().nullable(),
      isActive: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createReward: publicProcedure.input(z.object({
      name: z.string(),
      description: z.string().optional(),
      pointsCost: z.number(),
      imageUrl: z.string().optional(),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      pointsCost: z.number(),
      imageUrl: z.string().nullable(),
      isActive: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    redeemReward: publicProcedure.input(z.object({
      userId: z.string(),
      rewardId: z.string(),
    })).output(z.object({
      id: z.string(),
      userId: z.string(),
      rewardId: z.string(),
      pointsSpent: z.number(),
      status: z.string(),
      createdAt: z.date(),
      qrCodeDataUrl: z.string(),
      shortCode: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserRedemptionHistory: publicProcedure.input(z.object({ userId: z.string() })).output(z.array(z.object({
      id: z.string(),
      userId: z.string(),
      rewardId: z.string(),
      pointsSpent: z.number(),
      status: z.string(),
      createdAt: z.date(),
      qrCodeDataUrl: z.string(),
      shortCode: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  menuRouter: t.router({ findAll: publicProcedure.query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any) })
});
export type AppRouter = typeof appRouter;


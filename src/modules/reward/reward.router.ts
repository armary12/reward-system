import { Injectable } from '@nestjs/common';
import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { z } from 'zod';
import { RewardService } from './reward.service';
import {
  RewardSchema,
  RedemptionTransactionSchema,
  CreateRewardSchema,
  RedeemRewardSchema,
  Reward,
  RedemptionTransaction,
  CreateRewardInput,
} from './reward.schema';
import { LoggerMiddleware } from '../../trpc/middleware/logger.middleware';

@Injectable()
@Router()
@UseMiddlewares(LoggerMiddleware)
export class RewardRouter {
  constructor(private readonly rewardService: RewardService) {}

  @Query({
    output: z.array(RewardSchema),
  })
  async findAllRewards(): Promise<Reward[]> {
    const rewards = await this.rewardService.findAllRewards();
    return rewards.map(reward => RewardSchema.parse(reward));
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: RewardSchema,
  })
  async findRewardById(@Input('id') id: string): Promise<Reward> {
    const reward = await this.rewardService.findRewardById(id);
    return RewardSchema.parse(reward);
  }

  @Query({
    input: z.object({ userId: z.string() }),
    output: z.array(RewardSchema),
  })
  async getAvailableRewardsForUser(@Input('userId') userId: string): Promise<Reward[]> {
    const rewards = await this.rewardService.getAvailableRewardsForUser(userId);
    return rewards.map(reward => RewardSchema.parse(reward));
  }

  @Mutation({
    input: CreateRewardSchema,
    output: RewardSchema,
  })
  async createReward(@Input() data: CreateRewardInput): Promise<Reward> {
    const reward = await this.rewardService.createReward({
      name: data.name,
      description: data.description,
      pointsCost: data.pointsCost,
      imageUrl: data.imageUrl,
    });
    return RewardSchema.parse(reward);
  }

  @Mutation({
    input: RedeemRewardSchema,
    output: RedemptionTransactionSchema,
  })
  async redeemReward(
    @Input('userId') userId: string,
    @Input('rewardId') rewardId: string,
  ): Promise<RedemptionTransaction> {
    const redemption = await this.rewardService.redeemReward(userId, rewardId);
    return RedemptionTransactionSchema.parse(redemption);
  }

  @Query({
    input: z.object({ userId: z.string() }),
    output: z.array(RedemptionTransactionSchema),
  })
  async getUserRedemptionHistory(@Input('userId') userId: string): Promise<RedemptionTransaction[]> {
    const history = await this.rewardService.getUserRedemptionHistory(userId);
    return history.map(redemption => RedemptionTransactionSchema.parse(redemption));
  }
} 
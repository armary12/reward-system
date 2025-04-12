import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRewards() {
    return this.prisma.redeemableReward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });
  }

  async findRewardById(id: string) {
    const reward = await this.prisma.redeemableReward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }

    return reward;
  }

  async getAvailableRewardsForUser(userId: string) {
    // Get user's current points
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get rewards the user can afford
    return this.prisma.redeemableReward.findMany({
      where: {
        isActive: true,
        pointsCost: { lte: user.points },
      },
      orderBy: { pointsCost: 'asc' },
    });
  }

  async createReward(data: {
    name: string;
    description?: string;
    pointsCost: number;
    imageUrl?: string;
  }) {
    return this.prisma.redeemableReward.create({
      data,
    });
  }

  async redeemReward(userId: string, rewardId: string) {
    // Get the reward and validate
    const reward = await this.prisma.redeemableReward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward with ID ${rewardId} not found`);
    }

    if (!reward.isActive) {
      throw new BadRequestException('Reward is not active');
    }

    // Get the user and validate
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user has enough points
    if (user.points < reward.pointsCost) {
      throw new BadRequestException('Not enough points to redeem this reward');
    }

    // Use transaction to ensure all operations succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      // Create redemption transaction
      const redemption = await tx.redemptionTransaction.create({
        data: {
          userId: userId,
          rewardId: rewardId,
          pointsSpent: reward.pointsCost,
          status: 'completed', // Set status as completed immediately
        },
      });

      // Deduct points from user
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: reward.pointsCost,
          },
        },
      });

      // Create a negative transaction record for the points spent
      await tx.pointTransaction.create({
        data: {
          userId: userId,
          points: -reward.pointsCost,
          description: `Redeemed reward: ${reward.name}`,
        },
      });

      return redemption;
    });
  }

  async getUserRedemptionHistory(userId: string) {
    return this.prisma.redemptionTransaction.findMany({
      where: { userId: userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
    });
  }
} 
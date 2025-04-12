import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  findAllRewards() {
    return this.rewardService.findAllRewards();
  }

  @Get(':id')
  findRewardById(@Param('id') id: string) {
    return this.rewardService.findRewardById(id);
  }

  @Get('user/:userId/available')
  getAvailableRewardsForUser(@Param('userId') userId: string) {
    return this.rewardService.getAvailableRewardsForUser(userId);
  }

  @Post()
  createReward(
    @Body()
    data: {
      name: string;
      description?: string;
      pointsCost: number;
      imageUrl?: string;
    },
  ) {
    return this.rewardService.createReward(data);
  }

  @Post('redeem')
  redeemReward(
    @Body() data: { userId: string; rewardId: string },
  ) {
    return this.rewardService.redeemReward(data.userId, data.rewardId);
  }

  @Get('user/:userId/history')
  getUserRedemptionHistory(@Param('userId') userId: string) {
    return this.rewardService.getUserRedemptionHistory(userId);
  }
} 
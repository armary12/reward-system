import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { RewardRouter } from './reward.router';

@Module({
  controllers: [RewardController],
  providers: [RewardService, RewardRouter],
  exports: [RewardService, RewardRouter],
})
export class RewardModule {} 
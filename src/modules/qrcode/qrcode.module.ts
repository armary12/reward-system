import { Module } from '@nestjs/common';
import { QrCodeService } from './qrcode.service';
import { QrCodeController } from './qrcode.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RewardModule } from '../reward/reward.module';
import { QrCodeRouter } from './qrcode.router';

@Module({
  imports: [PrismaModule, UserModule, RewardModule],
  controllers: [QrCodeController],
  providers: [QrCodeService, QrCodeRouter],
  exports: [QrCodeService],
})
export class QrCodeModule {} 
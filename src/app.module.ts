import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { QrCodeModule } from './modules/qrcode/qrcode.module';
import { MenuModule } from './modules/menu/menu.module';
import { TrpcModule } from './trpc/trpc.module';
import { RewardModule } from './modules/reward/reward.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    QrCodeModule,
    MenuModule,
    RewardModule,
    TrpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
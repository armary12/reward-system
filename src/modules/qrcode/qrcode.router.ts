import { QrCodeService } from './qrcode.service';
import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { z } from 'zod';
import { 
  QrCodeResponseSchema,
  ValidationResponseSchema,
  RewardValidationResponseSchema,
  GenerateQrCodeSchema,
  GenerateRewardQrCodeSchema,
  ValidateCodeSchema,
  ValidateRewardCodeSchema,
  QrCodeResponse,
  ValidationResponse,
  RewardValidationResponse
} from './qrcode.schema';
import { LoggerMiddleware } from 'src/trpc/middleware/logger.middleware';

@Router()
@UseMiddlewares(LoggerMiddleware)
export class QrCodeRouter {
  constructor(private readonly qrCodeService: QrCodeService){}
 
  @Query({
    input: GenerateQrCodeSchema,
    output: QrCodeResponseSchema
  })
  async generateUserQrCode(@Input('userId') userId: string): Promise<QrCodeResponse> {
    const result = await this.qrCodeService.generateQrCode(userId);
    return QrCodeResponseSchema.parse(result);
  }

  @Query({
    input: GenerateRewardQrCodeSchema,
    output: QrCodeResponseSchema
  })
  async generateRewardQrcode(
    @Input('userId') userId: string,
    @Input('rewardId') rewardId: string,
  ): Promise<QrCodeResponse> {
    const result = await this.qrCodeService.generateRewardCode(userId, rewardId);
    return QrCodeResponseSchema.parse(result);
  }

  @Mutation({
    input: ValidateCodeSchema,
    output: ValidationResponseSchema
  })
  async validateCode(
    @Input('code') code: string,
    @Input('amountToAdd') amountToAdd: number,
    @Input('type') type: 'qr' | 'short'
  ): Promise<ValidationResponse> {
    const result = await this.qrCodeService.validateCode(code, amountToAdd, type);
    return ValidationResponseSchema.parse(result);
  }

  @Mutation({
    input: ValidateRewardCodeSchema,
    output: RewardValidationResponseSchema
  })
  async validateRewardCode(
    @Input('code') code: string
  ): Promise<RewardValidationResponse> {
    const result = await this.qrCodeService.validateRewardCode(code);
    return RewardValidationResponseSchema.parse(result);
  }
} 
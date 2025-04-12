import { Controller, Post, Body, Param } from '@nestjs/common';
import { QrCodeService } from './qrcode.service';

@Controller('qrcode')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('generate/:userId')
  generateQrCode(@Param('userId') userId: string) {
    return this.qrCodeService.generateQrCode(userId);
  }

  @Post('validate')
  validateCode(
    @Body() data: { code: string; amountToAdd: number; type: 'qr' | 'short' },
  ) {
    return this.qrCodeService.validateCode(data.code, data.amountToAdd, data.type);
  }
} 
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RewardService } from '../reward/reward.service';
import { createHash, randomBytes } from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  private readonly MAX_RETRIES = 10;
  private readonly CODE_LENGTH = 8;
  private readonly logger = new Logger(QrCodeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly rewardService: RewardService,
  ) {}

  // Generate a random 8-character alphanumeric code
  private generateShortCode(): string {
    // Using a combination of timestamp and random bytes to reduce collision probability
    const timestamp = Date.now().toString(36);
    const random = randomBytes(4).toString('hex').toUpperCase();
    const combined = timestamp + random;
    return combined.slice(0, this.CODE_LENGTH).toUpperCase();
  }

  async generateUniqueCode(): Promise<string> {
    let retries = 0;
    let shortCode: string;
    let existingCode;

    do {
      if (retries >= this.MAX_RETRIES) {
        throw new InternalServerErrorException('Unable to generate a unique code after multiple attempts');
      }

      shortCode = this.generateShortCode();
      
      // Check if the code exists and is not expired
      existingCode = await this.prisma.shortCode.findFirst({
        where: {
          code: shortCode,
          expiresAt: {
            gt: new Date(), // Only consider non-expired codes
          },
        },
      });

      retries++;
    } while (existingCode);

    return shortCode;
  }

  async generateQrCode(userId: string): Promise<{ qrCodeDataUrl: string; shortCode: string }> {
    try {
      // Generate a unique short code
      const shortCode = await this.generateUniqueCode();

      // Set expiration time (e.g., 5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Store the short code in the database
      await this.prisma.shortCode.create({
        data: {
          code: shortCode,
          userId: userId,
          expiresAt,
        },
      });

      // Generate QR code with the short code
      const qrCodeDataUrl = await QRCode.toDataURL(shortCode);

      return {
        qrCodeDataUrl,
        shortCode,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to generate QR code');
    }
  }

  async generateRewardCode(
    userId: string, 
    rewardId: string, 
  ): Promise<{ qrCodeDataUrl: string; shortCode: string }> {
    try {
      // Generate a unique short code
      const shortCode = await this.generateUniqueCode();

      // Set expiration time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Store the short code in the database with rewardId
      await this.prisma.shortCode.create({
        data: {
          code: shortCode,
          userId: userId,
          rewardId: rewardId,
          expiresAt,
        },
      });

      // Generate QR code with reward redemption data
      const qrCodeData = {
        type: 'reward_redemption',
        shortCode: shortCode,
        userId: userId,
        rewardId: rewardId,
      };
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrCodeData));

      return {
        qrCodeDataUrl,
        shortCode,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to generate reward code');
    }
  }

  private async validateAndAddPoints(
    code: string,
    amountToAdd: number,
    source: 'QR code' | 'short code',
  ): Promise<{
    success: boolean;
    userId?: string;
    pointsEarned?: number;
    message?: string;
    userName?: string;
  }> {
    // Find the short code in the database
    const shortCode = await this.prisma.shortCode.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!shortCode) {
      return { success: false, message: 'Code not found' };
    }

    if (shortCode.isUsed) {
      return { success: false, message: 'Code already used' };
    }

    if (shortCode.expiresAt < new Date()) {
      // Mark as used even though it's expired
      await this.prisma.shortCode.update({
        where: { id: shortCode.id },
        data: { isUsed: true, usedAt: new Date() },
      });
      return { success: false, message: 'Code expired' };
    }

    // Use a transaction to ensure both operations succeed or fail together
    await this.prisma.$transaction(async (tx) => {
      // Add points to the user
      await tx.user.update({
        where: { id: shortCode.userId },
        data: { points: { increment: amountToAdd } },
      });

      // Create point transaction record
      await tx.pointTransaction.create({
        data: {
          userId: shortCode.userId,
          points: amountToAdd,
          description: `Points earned from ${source}: ${code}`,
        },
      });

      // Mark the code as used
      await tx.shortCode.update({
        where: { id: shortCode.id },
        data: { isUsed: true, usedAt: new Date() },
      });
    });

    return {
      success: true,
      userId: shortCode.userId,
      userName: shortCode.user.name,
      pointsEarned: amountToAdd,
      message: 'Points added successfully',
    };
  }

  async validateCode(
    code: string,
    amountToAdd: number,
    type: 'qr' | 'short'
  ): Promise<{
    success: boolean;
    userId?: string;
    pointsEarned?: number;
    message?: string;
    userName?: string;
  }> {
    this.logger.log(`Validating ${type} code: ${code}`);
    const source = type === 'qr' ? 'QR code' : 'short code';
    return this.validateAndAddPoints(code, amountToAdd, source);
  }

  async validateRewardCode(
    code: string
  ): Promise<{
    success: boolean;
    redemptionId?: string;
    userId?: string;
    rewardId?: string;
    message?: string;
  }> {
    this.logger.log(`Validating reward code: ${code}`);
    
    // Find the short code in the database
    const shortCode = await this.prisma.shortCode.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!shortCode) {
      return { success: false, message: 'Code not found' };
    }

    if (!shortCode.rewardId) {
      return { success: false, message: 'Not a reward code' };
    }

    if (shortCode.isUsed) {
      return { success: false, message: 'Code already used' };
    }

    if (shortCode.expiresAt < new Date()) {
      // Mark as used even though it's expired
      await this.prisma.shortCode.update({
        where: { id: shortCode.id },
        data: { isUsed: true, usedAt: new Date() },
      });
      return { success: false, message: 'Code expired' };
    }

    // Mark the code as used
    await this.prisma.shortCode.update({
      where: { id: shortCode.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // Call the reward service's redeemReward function
    try {
      await this.rewardService.redeemReward(shortCode.userId, shortCode.rewardId);
      return {
        success: true,
        userId: shortCode.userId,
        rewardId: shortCode.rewardId,
        message: 'Reward redemption completed successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to redeem reward: ${error.message}`);
      return {
        success: false,
        message: 'Failed to redeem reward',
      };
    }
  }
} 
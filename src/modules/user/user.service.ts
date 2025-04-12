import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; name: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: { email?: string; name?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateUserPoints(id: string, points: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        points,
        updatedAt: new Date(),
      },
    });
  }

  async addPoints(userId: string, points: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  }
} 
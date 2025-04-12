import { Injectable } from '@nestjs/common';
import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { z } from 'zod';
import { UserService } from './user.service';
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UpdatePointsSchema,
  User,
  CreateUserInput,
  UpdateUserInput,
} from './user.schema';
import { LoggerMiddleware } from '../../trpc/middleware/logger.middleware';

@Injectable()
@Router()
@UseMiddlewares(LoggerMiddleware)
export class UserRouter {
  constructor(private readonly userService: UserService) {}

  @Query({
    output: z.array(UserSchema),
  })
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map(user => UserSchema.parse(user));
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: UserSchema,
  })
  async findOne(@Input('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return UserSchema.parse(user);
  }

  @Mutation({
    input: CreateUserSchema,
    output: UserSchema,
  })
  async create(@Input() data: CreateUserInput): Promise<User> {
    const user = await this.userService.create({
      email: data.email,
      name: data.name,
    });
    return UserSchema.parse(user);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: UpdateUserSchema,
    }),
    output: UserSchema,
  })
  async update(
    @Input('id') id: string,
    @Input('data') data: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userService.update(id, {
      email: data.email,
      name: data.name,
    });
    return UserSchema.parse(user);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: UserSchema,
  })
  async remove(@Input('id') id: string): Promise<User> {
    const user = await this.userService.remove(id);
    return UserSchema.parse(user);
  }

  @Mutation({
    input: UpdatePointsSchema,
    output: UserSchema,
  })
  async updatePoints(
    @Input('userId') userId: string,
    @Input('points') points: number,
  ): Promise<User> {
    const user = await this.userService.updateUserPoints(userId, points);
    return UserSchema.parse(user);
  }

  @Mutation({
    input: UpdatePointsSchema,
    output: UserSchema,
  })
  async addPoints(
    @Input('userId') userId: string,
    @Input('points') points: number,
  ): Promise<User> {
    const user = await this.userService.addPoints(userId, points);
    return UserSchema.parse(user);
  }
} 
import { Injectable } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Router, Query, UseMiddlewares } from 'nestjs-trpc';
import { z } from 'zod';
import { 
  RootMenu,
} from './menu.schema';
import { LoggerMiddleware } from '../../trpc/middleware/logger.middleware';

@Router()
@UseMiddlewares(LoggerMiddleware)
export class MenuRouter {
  constructor(private readonly menuService: MenuService){}
 
  @Query()
  async findAll(): Promise<RootMenu> {
    const menu = await this.menuService.findAll();
    return RootMenu.parse(menu);
  }

//   @Query()
//   async findByCategory(input: z.infer<typeof GetByCategorySchema>): Promise<MenuGroup | null> {
//     const result = await this.menuService.findByCategory(input.category);
//     return result ? MenuGroupSchema.parse(result) : null;
//   }

//   @Query()
//   async findById(input: z.infer<typeof GetByIdSchema>): Promise<MenuItem | null> {
//     const result = await this.menuService.findById(input.id);
//     return result ? MenuItemSchema.parse(result) : null;
//   }
}
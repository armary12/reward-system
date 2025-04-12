import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuRouter } from './menu.router';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuRouter],
  exports: [MenuService, MenuRouter],
})
export class MenuModule {} 
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as menuData from '../../data/menu.json';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

@Injectable()
export class MenuService {
  private menuItems: MenuItem[] = [];
  private menu = menuData;

  constructor() {
    this.loadMenuItems();
  }

  private loadMenuItems() {
    try {
      const menuPath = path.join(process.cwd(), 'src', 'data', 'menu.json');
      const menuData = fs.readFileSync(menuPath, 'utf8');
      this.menuItems = JSON.parse(menuData);
    } catch (error) {
      console.error('Error loading menu items:', error);
      this.menuItems = [];
    }
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItems;
  }

  findByCategory(category: string) {
    return this.menu.menuGroups.find(group => group.name === category);
  }

  findById(id: string) {
    for (const group of this.menu.menuGroups) {
      for (const subGroup of group.menuGroups) {
        const item = subGroup.menuItems.find(item => item.guid === id);
        if (item) return item;
      }
    }
    return null;
  }
} 
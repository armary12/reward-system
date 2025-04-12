import { z } from 'zod';

// Menu Item Schema
export const MenuItem = z.object({
  guid: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  image: z.string().url().nullable(),
  availability: z.string().nullable(),
  note: z.string().nullable(),
});

// Menu Group Schema
export const MenuGroup = z.object({
  name: z.string(),
  menuGroups: z.array(z.object({
    name: z.string(),
    menuItems: z.array(MenuItem)
  }))
});

// Root Menu Schema
export const RootMenu = z.object({
  name: z.string(),
  menuGroups: z.array(MenuGroup)
});

// Input Schemas for Procedures
export const GetByCategory = z.object({
  category: z.string()
});

export const GetById = z.object({
  id: z.string()
});

// Response Types
export type MenuItem = z.infer<typeof MenuItem>;
export type MenuGroup = z.infer<typeof MenuGroup>;
export type RootMenu = z.infer<typeof RootMenu>; 
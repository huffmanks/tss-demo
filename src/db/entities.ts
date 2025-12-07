import { z } from "zod";

export const recipeSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  totalTime: z.number().optional(),
  servingSize: z.number(),
  userId: z.uuidv7(),
  categoryId: z.uuidv7(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const categorySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
});

export const cuisineSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  slug: z.string(),
});

export const tagSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  slug: z.string(),
});

export const ingredientSchema = z.object({
  id: z.uuidv7(),
  recipeId: z.uuidv7(),
  amount: z.number().optional(),
  unit: z.string().optional(),
  name: z.string(),
  order: z.number(),
});

export const instructionSchema = z.object({
  id: z.uuidv7(),
  recipeId: z.uuidv7(),
  name: z.string(),
  isHeading: z.boolean().optional(),
  order: z.number(),
});

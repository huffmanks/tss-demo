import { z } from "zod";

export const recipeSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servingSize: z.number(),
  authorNotes: z.string().optional(),
  nutrition: z.array(z.unknown()),
  organizationId: z.uuidv7(),
  userId: z.uuidv7(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const imageSchema = z.object({
  id: z.uuidv7(),
  url: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const categorySchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
});

export const cuisineSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
});

export const dietSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
});

export const tagSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
});

export const unitSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  abbreviation: z.string(),
  type: z.string(),
  system: z.string(),
});

export const ingredientSectionSchema = z.object({
  id: z.uuidv7(),
  recipeId: z.uuidv7(),
  title: z.string(),
  position: z.number(),
});

export const ingredientSchema = z.object({
  id: z.uuidv7(),
  amount: z.number().optional(),
  name: z.string(),
  sectionId: z.uuidv7(),
  position: z.number(),
  unit: z.uuidv7().optional(),
});

export const instructionSectionSchema = z.object({
  id: z.uuidv7(),
  recipeId: z.uuidv7(),
  title: z.string(),
  position: z.number(),
});

export const instructionSchema = z.object({
  id: z.uuidv7(),
  content: z.string(),
  sectionId: z.uuidv7(),
  position: z.number(),
});

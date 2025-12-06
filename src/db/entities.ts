import { z } from "zod";

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  completed: z.boolean().optional(),
  userId: z.uuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

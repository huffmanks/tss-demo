import { z } from "zod";

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

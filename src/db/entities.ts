import { z } from "zod";

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  completed: z.boolean().default(false),
  userId: z.uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

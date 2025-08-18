import { z } from "zod";

export const BlogValidation = z.object({
  title: z
    .string()
    .min(7, { error: "Title must be at least 7 characters" })
    .max(50, { error: "Title must be at most 50 characters" })
    .trim(),
  shortDescription: z
    .string()
    .min(10, { error: "Short description must be at least 10 characters" })
    .max(50, { error: "Short description must be at most 50 characters" })
    .trim(),
  content: z
    .string()
    .min(100, { error: "Content must be at least 100 characters" })
    .trim(),
});
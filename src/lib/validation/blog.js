import { z } from "zod";

export const BlogValidation = z.object({
  title: z
    .string() 
    .nonempty({ message: "Title is required" })
    .min(7, { message: "Title must be at least 7 characters" })
    .max(50, { message: "Title must be at most 50 characters" })
    .trim(),

  shortDescription: z
    .string()
    .nonempty({ message: "Short Description is required" })
    .min(10, { message: "Short Description must be at least 10 characters" })
    .max(150, { message: "Short Description must be at most 150 characters" })
    .trim(),
  content: z
    .string({ required_error: "Content is required" })
    .nonempty({ message: "content is required" })
    .min(100, { message: "Content must be at least 100 characters" })
    .trim(),

  tags: z.string().trim().optional(),

  // image: z
  //     .object({
  //       url: z.string().url({ message: "Image URL must be a valid URL" }).optional(),
  //       alt: z.string().max(200, { message: "Alt text must be at most 200 characters" }).optional().default("")
  //     })
  //     .optional()
  //     .default({ url: "", alt: "" })
});

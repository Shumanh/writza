import { z } from "zod";

export const blogSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title should not exceed 50 characters" })
    .trim(),

  slug: z.string({
    required_error: "Slug is required",
    invalid_type_error: "Slug must be a string",
  })
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    })
    .trim()
    .toLowerCase(),

  shortDescription: z.string({
    required_error: "Short description is required",
    invalid_type_error: "Short description must be a string",
  })
    .min(1, { message: "Short description is required" })
    .max(150, { message: "Short description should not exceed 150 characters" })
    .trim(),

  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  })
    .min(1, { message: "Content is required" })
    .trim(),

  tags: z.array(
    z.string()
      .trim()
      .toLowerCase()
      .max(25, { message: "Each tag should not exceed 25 characters" })
  ).optional().default([]),

  image: z.object({
    url: z.string().url("Please provide a valid image URL").optional().default(""),
    alt: z.string()
      .max(200, { message: "Alt text should not exceed 200 characters" })
      .optional()
      .default("")
  }).optional().default({ url: "", alt: "" }),

  author: z.string({
    required_error: "Author is required",
    invalid_type_error: "Author must be a string",
  })
    .min(1, { message: "Author is required" }),

  publishedAt: z.date().optional().nullable()
});

// Schema for creating a new blog (without author, as it comes from session)
export const createBlogSchema = blogSchema.omit({ author: true });

// Schema for updating a blog (all fields optional except id)
export const updateBlogSchema = blogSchema.partial().extend({
  id: z.string().min(1, { message: "Blog ID is required" })
});

export default blogSchema; 
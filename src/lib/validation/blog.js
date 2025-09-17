import { z } from "zod";

// Common patterns and messages
const patterns = {
  noSpecialChars: /^[a-zA-Z0-9 .,!?-]+$/,
  noHtmlTags: /<[^>]*>?/gm,
  profanity: /(badword1|badword2|curseword)/i,
};

const messages = {
  noSpecialChars: "Title can only contain letters, numbers, and basic punctuation",
  noProfanity: "Please keep the content professional and respectful",
  noHtml: "HTML tags are not allowed",
  minWords: (min) => `Must be at least ${min} words`,
};

export const BlogValidation = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required" })
    .min(7, { message: "Title must be at least 7 characters" })
    .max(50, { message: "Title must be at most 50 characters" })
    .regex(patterns.noSpecialChars, { message: messages.noSpecialChars }),

  shortDescription: z
    .string()
    .nonempty({ message: "Short Description is required" })
    .min(10, { message: "Short Description must be at least 10 characters" })
    .max(150, { message: "Short Description must be at most 150 characters" })
    .refine((val) => val.split(/\s+/).filter(word => word !== "").length >= 5, {
      message: messages.minWords(5),
    })
    .refine((val) => !patterns.profanity.test(val), {
      message: messages.noProfanity,
    }) ,
    

  content: z
    .string({ required_error: "Content is required" })
    .nonempty({ message: "Content is required" })
    .min(100, { message: "Content must be at least 100 characters" })
    .refine((val) => val.trim().split(/\s+/).length >= 20, {
      message: messages.minWords(20),
    })
    .refine((val) => !patterns.profanity.test(val), {
      message: messages.noProfanity,
    }) ,
   

  tags: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const tags = val.split(",").map(tag => tag.trim());
        return tags.every(tag => /^[a-zA-Z0-9\s-]+$/.test(tag));
      },
      { message: "Tags can only contain letters, numbers, spaces, and hyphens" }
    )
    .refine(
      (val) => {
        if (!val) return true;
        const tags = val.split(",").map(tag => tag.trim());
        return tags.length <= 5;
      },
      { message: "You can add up to 5 tags maximum" }
    ),

  // image: z.object({
  //   url: z
  //     .string()
  //     .url({ message: "Image URL must be a valid URL" })
  //     .refine(
  //       (url) => url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null,
  //       { message: "Image must be a valid image URL (jpeg, jpg, gif, png, webp)" }
  //     )
  //     .optional(),
  //   alt: z
  //     .string()
  //     .max(200, { message: "Alt text must be at most 200 characters" })
  //     .optional()
  //     .default(""),
  // }).optional(),
});

import { z } from "zod";

export const BlogValidation = z.object({
  title: z
    .string( { required_error:"Title is required"})
    .min(7, { message: "Title must be at least 7 characters" })
    .max(50, { message: "Title must be at most 50 characters" })
    .trim() , 

  
  shortDescription: z
    .string({required_error:"short Descripiton is required"})
    .min(10, { message: "Short description must be at least 10 characters" })
    .max(150, { message: "Short description must be at most 150 characters" }) 
    .trim()
    ,
  
  content: z
    .string({required_error:"Content is required"})
    .min(100, { message: "Content must be at least 100 characters" })
    .trim()
    
    ,
  
  tags: z
      .array(
        z.string().trim()
        .optional()
      ),
    
    
  image: z
      .object({
        url: z.string().url({ message: "Image URL must be a valid URL" }).optional(),
        alt: z.string().max(200, { message: "Alt text must be at most 200 characters" }).optional().default("")
      })
      .optional()
      .default({ url: "", alt: "" })
});



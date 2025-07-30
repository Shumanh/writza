import { z } from "zod";

// User registration schema
export const userSchema = z.object({
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  email: z.string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*()\-+=|\[\]{}\\\/,.<>\?`~])/,
      {
        message: "Password must include uppercase, lowercase, number, and special character",
      }
    ),
});

export const loginSchema = z.object({
  email: z.string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(1, { message: "Password is required" })
});

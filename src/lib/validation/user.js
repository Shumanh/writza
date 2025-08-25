import { z } from 'zod'
 
export const UserformSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{8,}$/,
      { message: 'Include uppercase, lowercase, number and special character.' }
    )
    .trim(),
  confirmPassword: z.string({ required_error: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const LoginFormSchema = z.object({
  email: z
  .string()
  .email({ message: 'Please enter a valid email.' })
  .trim(),

  password: z
  .string({ message: 'Password is required' })
});
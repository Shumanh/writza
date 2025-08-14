"use server"

import { SignupFormSchema } from '@/app/lib/definitions'
import User from '@/db/models/User'
import { dbConnect } from '@/lib/db/mongodb'


export async function signup(_prevState, formData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, email, password } = validatedFields.data
  const normalizedUsername = String(username).trim().toLowerCase()
  const normalizedEmail = String(email).trim().toLowerCase()

  try {
    await dbConnect()
  } catch (err) {
    console.error('DB connection error:', err)
    return { errors: { global: 'Database connection failed. Check MONGODB_URI and network.' } }
  }

  const existingByEmail = await User.findOne({ email: normalizedEmail })
  if (existingByEmail) {
    return { errors: { email: ['Email is already registered'] } }
  }

  const existingByUsername = await User.findOne({ username: normalizedUsername })
  if (existingByUsername) {
    return { errors: { username: ['Username is taken'] } }
  }

  try {
    const newUser = new User({ username: normalizedUsername, email: normalizedEmail, password })
    await newUser.save()
    return { success: true }
  } catch (error) {
    console.error('Error saving user:', error)
    return { errors: { global: 'An error occurred while creating new account.' } }
  }
}


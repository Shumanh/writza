"use server"

import { UserFormSchema } from '@/app/lib/definitions'
import User from '@/db/models/User'
import { dbConnect } from '@/lib/db/mongodb'


export async function Signup(_prevState, formData) {
  const validatedFields = UserFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.fieldErrors,
    }
  }

  const { username, email, password } = validatedFields.data
  const Username = String(username)
  const Email = String(email)
  const Password = String(password)

  try {
    await dbConnect()
  } catch (err) {
    console.error('DB connection error:', err)
    return { errors: { global: 'Database connection failed. Check MONGODB_URI and network.' } }
  }

  const existingByEmail = await User.findOne({ email: Email })
  if (existingByEmail) {
    return { errors: { email: ['Email is already registered'] } }
  }

  const existingByUsername = await User.findOne({ username: Username })
  if (existingByUsername) {
    return { errors: { username: ['Username is taken'] } }
  }

  try {
    const newUser = new User({ username: Username, email: Email, password })
    await newUser.save()
    return { success: true }
  } catch (error) {
    console.error('Error saving user:', error)
    return { errors: { global: 'An error occurred while creating new account.' } }
  }
}


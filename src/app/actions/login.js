"use server"

import { dbConnect } from "@/lib/db/mongodb";
import { LoginFormSchema } from "../lib/definitions";
import bcrypt from 'bcrypt'
import User from "@/db/models/User";

export async function Login(_prevState, formData) {
  const loginValidation = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!loginValidation.success) {
    return {
      success: false,
      errors: loginValidation.error.fieldErrors,
      message: "Validation failed"
    };
  }

  const { email, password } = loginValidation.data;

  try {
    await dbConnect();
  } catch (err) {
    return {
      success: false,
      errors: {},
      message: "Database connection failed. Check MONGODB_URI and network."
    };
  }

  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        errors: {},
        message: "Login failed, register first."
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: "Login failed, register first."
    };
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        errors: {},
        message: "Invalid credentials."
      };
    }
    return {
      success: true,
      errors: {},
      message: "User logged in successfully."
    };
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: "Error checking password."
    };
  }
}
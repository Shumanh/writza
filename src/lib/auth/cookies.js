import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

export async function getUserFromCookies(){
  try{
    const cookieStore = await cookies()
    const userToken = cookieStore.get('token')?.value
    
    if(!userToken){
      return {
        error: true, 
        message: "Cookie could not be found" 
      }
    }
    
    const verifyUser = verifyToken(userToken)
    if(!verifyUser){
      return {
        error: true,
        message: "User could not be verified, invalid token"
      }
    }

    // Check if user has admin role
    if(verifyUser.role !== "admin"){
      return {
        error: true, 
        message: "Not an admin"
      } 
    }
    
    return {
      error: false, 
      message: "Token verified successfully", 
      user: verifyUser.role,
      data: verifyUser
    }
  }
  catch(error){
    console.error("Error in Cookies function:", error)
    return {
      error: true, 
      message: "Cookie error"
    }
  }
}

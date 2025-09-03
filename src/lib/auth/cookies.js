import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

export async  function getUserFromCookies(){
  
  try{
const cookieStore  = await cookies()
const userToken = cookieStore.get('token')?.value
if(!userToken){
return ( {
  error : true , 
  message : " cookie could not be found " 
})
}
const verifyUser =  verifyToken(userToken)
if(!verifyUser){
  return ({
    error : true ,
    message : " user could not be verified , invalid token"
  })
}
else 
  return ({
error:false , 
message : "Token verified successfully" , 
data : verifyUser
})
  }
  catch(error){
    console.error("Error in Cookies function : " , error)
    return ({
      error:true , 
      message : " cookie error"
    })
  }
}

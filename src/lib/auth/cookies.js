import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

export async function Cookies() {
  try {
    const cookieStore =  await cookies();
    const token =  cookieStore.get("token")?.value;

    if (!token) return null;

    const verifyUser = verifyToken(token);
    console.log("verified", verifyUser);
    if (!verifyUser) return null;
    return verifyUser; 

  } catch (error) {
    console.error("Error in Cookies function:", error);
    return null;
  }
}

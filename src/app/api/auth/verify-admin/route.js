import { getUserFromCookies } from "@/lib/auth/cookies";
import { dbConnect } from "@/lib/db/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const result = await getUserFromCookies();
    
    if (result.error) {
      return Response.json({
        error: true,
        isAdmin: false,
        message: result.message
      });
    }

    // Fetch full user to get email (token payload may not include email)
    let email = null;
    try {
      await dbConnect();
      const userId = result?.data?.id;
      if (userId) {
        const user = await User.findById(userId).select('email');
        email = user?.email || null;
      }
    } catch (_e) {}

    const initial = (email && typeof email === 'string' && email.length > 0)
      ? email[0].toUpperCase()
      : null;

    const isAdmin = String(result?.data?.role || '').toLowerCase() === 'admin';
    return Response.json({
      error: false,
      isAdmin,
      message: "Admin verified successfully",
      email,
      initial
    });
  } catch (error) {
    console.error("Verify admin error:", error);
    return Response.json({
      error: true,
      isAdmin: false,
      message: "Verification failed"
    });
  }
}

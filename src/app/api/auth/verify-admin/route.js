import { getUserFromCookies } from "@/lib/auth/cookies";

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

    return Response.json({
      error: false,
      isAdmin: true,
      message: "Admin verified successfully"
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



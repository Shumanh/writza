import { getUserFromCookies } from "@/lib/auth/cookies";

export async function GET() {
  try {
    const res = await getUserFromCookies();
    if (res.error) {
      return Response.json({ loggedIn: false });
    }
    const { id, username, role } = res.data || {};
    return Response.json({ loggedIn: true, id, username, role });
  } catch (_e) {
    return Response.json({ loggedIn: false });
  }
}



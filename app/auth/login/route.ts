import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { COOKIE_NAME } from "@/config";

export async function GET() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get(COOKIE_NAME)?.value;

  const url = await getSignInUrl({
    state: JSON.stringify({ anonId }),
  });

  redirect(url);
}

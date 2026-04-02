import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { COOKIE_NAME } from "@/config";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const anonId = cookieStore.get(COOKIE_NAME)?.value;

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") ?? undefined;

  const url = await getSignInUrl({
    state: JSON.stringify({ anonId }),
    returnTo,
  });

  redirect(url);
}

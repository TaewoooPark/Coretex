import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authCookieName } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(authCookieName);
  redirect("/auth/sign-in");
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authCookieName } from "@/lib/auth";
import { DEMO_USER_ID } from "@/lib/mock-db";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(authCookieName, DEMO_USER_ID, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  redirect("/app");
}

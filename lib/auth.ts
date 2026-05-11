import { cookies } from "next/headers";
import { DEMO_USER_ID } from "./mock-db";

export const authCookieName = "coretex_user_id";

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(authCookieName)?.value ?? DEMO_USER_ID;
}

export function demoActor(userId = DEMO_USER_ID) {
  return { userId };
}

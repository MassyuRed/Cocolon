// lib/user.ts
import { supabase } from "./supabase";

/**
 * Supabase Auth から「今ログインしているユーザーID」を取得する。
 * ログインしていなければ null。
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("[getCurrentUserId] auth.getUser error:", error);
    return null;
  }
  const user = data.user;
  if (!user) {
    console.warn("[getCurrentUserId] no user in session");
    return null;
  }
  return user.id;
}

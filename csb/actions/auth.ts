"use server";

import { signIn, signOut } from "@/auth";

export async function login(credentials: any) {
  return await signIn("credentials", credentials);
}

export async function loginWithGoogle() {
  return await signIn("google");
}

export async function logout() {
  return await signOut();
}

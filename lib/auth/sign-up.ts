"use client";
import { authClient } from "@/lib/auth-client";

export async function signUpEmail({ email, password, name, image }:{
  email: string; password: string; name: string; image?: string;
}) {
  return authClient.signUp.email(
    { email, password, name, image, callbackURL: "/dashboard" },
    {
      onRequest: () => {},
      onSuccess: () => {},
      onError: (ctx) => alert(ctx.error.message),
    }
  );
}

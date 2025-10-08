"use client";
import { authClient } from "@/lib/auth-client";

export async function signInEmail({ email, password }:{
  email: string; password: string;
}) {
  return authClient.signIn.email(
    { email, password, callbackURL: "/dashboard", rememberMe: true },
    {
      onError: (ctx) => alert(ctx.error.message),
    }
  );
}

export async function signInGithub() {
  return authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
    errorCallbackURL: "/error",
  });
}

export async function signInGoogle() {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
    errorCallbackURL: "/error",
  });
}

// src/components/AuthModal.tsx
"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

import { signInEmail, signInGithub, signInGoogle } from "@/lib/auth/sign-in";
import { signUpEmail as doSignUp } from "@/lib/auth/sign-up";

type Props = { open: boolean; onClose: () => void };

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  if (!open) return null;

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setPending(true);
    setStatus("idle");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await doSignUp({ email, password, name });
        if (error) {
          setStatus("error");
          setMessage(error.message ?? "Failed to sign up");
        } else {
          setStatus("success");
          setMessage("Account created! Redirecting…");
        }
      } else {
        const { error } = await signInEmail({ email, password });
        if (error) {
          setStatus("error");
          setMessage(error.message ?? "Failed to sign in");
        } else {
          setStatus("success");
          setMessage("Welcome back! Redirecting…");
        }
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message ?? "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function handleGithub() {
    setPending(true);
    setStatus("idle");
    setMessage("");
    try {
      await signInGithub();
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message ?? "GitHub sign-in failed");
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setPending(true);
    setStatus("idle");
    setMessage("");
    try {
      await signInGoogle();
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message ?? "Google sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          {mode === "signup"
            ? "Sign up with email or continue with a provider."
            : "Sign in with your email or continue with a provider."}
        </p>

        {/* Animated status banner (no alerts) */}
        {status !== "idle" && (
          <div
            className={cn(
              "mt-4 rounded-md border p-2 text-sm animate-in fade-in slide-in-from-top-2",
              status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            )}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <form className="my-8 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <LabelInputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </LabelInputContainer>
          )}

          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </LabelInputContainer>

          <button
            className={cn(
              "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white",
              "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
              "dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
              pending && "opacity-70"
            )}
            type="submit"
            disabled={pending}
          >
            {pending ? "Please wait..." : mode === "signup" ? "Sign up →" : "Sign in →"}
            <BottomGradient />
          </button>

          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-3">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={handleGithub}
              disabled={pending}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with GitHub
              </span>
              <BottomGradient />
            </button>

            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={handleGoogle}
              disabled={pending}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button className="underline" onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          ) : (
            <>
              No account?{" "}
              <button className="underline" onClick={() => setMode("signup")}>
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}

function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}

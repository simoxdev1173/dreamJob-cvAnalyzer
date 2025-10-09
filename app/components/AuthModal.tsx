// src/components/AuthModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Assuming you use NextAuth.js for session management
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle, IconX } from "@tabler/icons-react";

import { signInEmail, signInGithub, signInGoogle } from "@/lib/auth/sign-in";
import { signUpEmail as doSignUp } from "@/lib/auth/sign-up";

type Props = { open: boolean; onClose: () => void };

export default function AuthModal({ open, onClose }: Props) {
  const router = useRouter();
  // Get the session status from your auth provider
  const { data: session, status: sessionStatus } = useSession();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  // Use a single state for status messages for cleaner updates
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  // --- NEW: Smart Redirect Effect ---
  // If the modal tries to open but the user is already logged in, redirect them.
  useEffect(() => {
    if (open && sessionStatus === "authenticated") {
      router.push("/dashboard");
      onClose(); // Close the modal immediately
    }
  }, [open, sessionStatus, router, onClose]);

  if (!open || sessionStatus === "authenticated") return null;

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response =
        mode === "signup"
          ? await doSignUp({ email, password, name })
          : await signInEmail({ email, password });

      if (response.error) {
        setStatus({ type: "error", message: response.error.message ?? "An unknown error occurred." });
      } else {
        // --- IMPROVEMENT: Redirect on Success ---
        setStatus({ type: "success", message: mode === "signup" ? "Account created! Redirecting..." : "Welcome back! Redirecting..." });
        // Use a short timeout to allow the user to read the success message
        setTimeout(() => {
          router.push("/dashboard");
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message ?? "Something went wrong." });
    } finally {
      setPending(false);
    }
  }

  async function handleProviderSignIn(provider: () => Promise<any>, providerName: string) {
    setPending(true);
    setStatus({ type: "idle", message: "" });
    try {
        // OAuth providers handle their own redirects. The user will be sent
        // to the provider and then back to your app, where they will be authenticated.
        await provider();
    } catch (e: any) {
        setStatus({ type: "error", message: `${providerName} sign-in failed.` });
        setPending(false);
    }
    // No need to set pending to false in a finally block here,
    // as the page will redirect away for the OAuth flow.
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in">
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-4 md:p-8 dark:bg-black animate-in fade-in-90 slide-in-from-bottom-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800">
            <IconX size={20} />
          </button>
        </div>

        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          {mode === "signup"
            ? "Sign up to start analyzing your CVs."
            : "Sign in to access your dashboard."}
        </p>

        {/* --- IMPROVEMENT: Dynamic Status Banner --- */}
        {status.type !== "idle" && (
          <div
            className={cn(
              "mt-4 rounded-md border p-3 text-sm animate-in fade-in",
              status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300"
            )}
            role="alert"
          >
            {status.message}
          </div>
        )}

        <form className="my-8 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <LabelInputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name" placeholder="Jane Doe" type="text"
                value={name} onChange={(e) => setName(e.target.value)} required
              />
            </LabelInputContainer>
          )}

          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email" placeholder="you@example.com" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password" placeholder="••••••••" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required minLength={8}
            />
          </LabelInputContainer>

          <button
            className={cn(
              "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white",
              "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
              "dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
              "disabled:opacity-60"
            )}
            type="submit" disabled={pending}
          >
            {pending ? "Please wait..." : mode === "signup" ? "Sign up →" : "Sign in →"}
            <BottomGradient />
          </button>

          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-3">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] dark:hover:bg-zinc-800"
              type="button"
              onClick={() => handleProviderSignIn(signInGithub, "GitHub")}
              disabled={pending}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] dark:hover:bg-zinc-800"
              type="button"
              onClick={() => handleProviderSignIn(signInGoogle, "Google")}
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
              <button className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-500" onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          ) : (
            <>
              No account?{" "}
              <button className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-500" onClick={() => setMode("signup")}>
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components (no changes needed)
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

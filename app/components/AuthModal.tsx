"use client";
import { useState } from "react";
import { signInEmail, signInGithub, signInGoogle } from "@/lib/auth/sign-in";
import { signUpEmail as doSignUp } from "@/lib/auth/sign-up";

export default function AuthModal({ open, onClose }:{
  open: boolean; onClose: () => void;
}) {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!open) return null;

  async function handleSubmit() {
    if (mode === "signup") {
      await doSignUp({ email, password, name });
    } else {
      await signInEmail({ email, password });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{mode === "signup" ? "Create account" : "Welcome back"}</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {mode === "signup" && (
          <input className="border p-2 w-full rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        )}
        <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

        <button onClick={handleSubmit} className="w-full border py-2 rounded">
          {mode === "signup" ? "Sign up" : "Sign in"}
        </button>

        <div className="text-center text-sm text-gray-500">or</div>

        <div className="flex gap-2">
          <button onClick={signInGoogle} className="flex-1 border py-2 rounded">Continue with Google</button>
          <button onClick={signInGithub} className="flex-1 border py-2 rounded">Continue with GitHub</button>
        </div>

        <div className="text-sm text-center">
          {mode === "signup" ? (
            <>Already have an account?{" "}
              <button className="underline" onClick={()=>setMode("login")}>Sign in</button></>
          ) : (
            <>No account?{" "}
              <button className="underline" onClick={()=>setMode("signup")}>Create one</button></>
          )}
        </div>
      </div>
    </div>
  );
}

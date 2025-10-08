// src/app/dashboard/DashboardClient.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type Props = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export default function DashboardClient({ user }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  function onPickFile() {
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // TODO: wire your upload endpoint here (e.g., /api/upload)
    try {
      setUploading(true);
      // const form = new FormData();
      // form.append("file", file);
      // await fetch("/api/upload-cv", { method: "POST", body: form });
      // router.refresh(); // if the page reads server data after upload
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-black">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold">
              DJ
            </span>
            <div>
              <h1 className="text-lg font-semibold">dreamJob • Dashboard</h1>
              <p className="text-xs opacity-70">Analyze & improve your CV</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{user.name ?? "Anonymous"}</div>
                <div className="text-xs opacity-70">{user.email}</div>
              </div>
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                {user.image ? (
                  <Image src={user.image} alt="avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm">
                    {initials(user.name ?? user.email ?? "U")}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-foreground/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main layout: sidebar + content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px,1fr]">
        {/* Sidebar */}
        <aside className="h-max rounded-xl border border-border bg-background p-3">
          <nav className="space-y-1 text-sm">
            <SectionLabel>Overview</SectionLabel>
            <SidebarLink href="#" active>Dashboard</SidebarLink>
            <SidebarLink href="#">Insights</SidebarLink>
            <SidebarLink href="#">History</SidebarLink>

            <SectionLabel>CV</SectionLabel>
            <SidebarLink href="#">Upload</SidebarLink>
            <SidebarLink href="#">Templates</SidebarLink>
            <SidebarLink href="#">Recommendations</SidebarLink>

            <SectionLabel>Account</SectionLabel>
            <SidebarLink href="#">Profile</SidebarLink>
            <SidebarLink href="#">Billing</SidebarLink>
            <SidebarLink href="#">Settings</SidebarLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-6">
          {/* Upload card */}
          <section className="rounded-xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Upload your CV</h2>
              <button
                onClick={onPickFile}
                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-foreground/10"
              >
                Choose file
              </button>
            </div>

            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              role="region"
              aria-label="CV upload area"
            >
              <div className="rounded-lg border border-dashed border-border p-6 text-sm">
                <p className="mb-2 font-medium">Drag & drop your CV (PDF/DOCX)</p>
                <p className="opacity-70">
                  We’ll analyze keywords, structure, and give you concrete suggestions.
                </p>

                <div className="mt-4 text-xs opacity-70">
                  {fileName ? (
                    <span>Selected: <strong>{fileName}</strong></span>
                  ) : (
                    <span>No file selected yet.</span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={onFileChange}
                />

                <div className="mt-4">
                  <button
                    disabled={uploading || !fileName}
                    className="rounded-md border border-border px-3 py-2 text-sm hover:bg-foreground/10 disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Upload & Analyze"}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-border p-6">
                <h3 className="mb-2 text-sm font-medium">Tips</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
                  <li>Use a clean PDF/DOCX export without images of text.</li>
                  <li>Keep contact info and job titles consistent.</li>
                  <li>Tailor skills to the roles you’re targeting.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Analytics / Recent uploads grid (placeholders) */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card title="Keyword Match">
              <div className="text-sm opacity-80">No data yet. Upload a CV to see insights.</div>
            </Card>
            <Card title="Readability">
              <div className="text-sm opacity-80">We’ll score structure, clarity, and length.</div>
            </Card>
            <Card title="Recent Uploads">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="opacity-80">No uploads yet.</span>
                  <span className="text-xs opacity-60">—</span>
                </li>
              </ul>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 mb-1 px-2 text-xs uppercase tracking-wide opacity-60">{children}</div>;
}

function SidebarLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block rounded-md px-2 py-2 ${
        active ? "bg-foreground/10 font-medium" : "hover:bg-foreground/10"
      }`}
    >
      {children}
    </a>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}

function initials(s: string) {
  const parts = s.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

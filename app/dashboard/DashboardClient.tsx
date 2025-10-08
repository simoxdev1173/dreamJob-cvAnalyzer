"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import ResumeCard from "../components/ResumeCard";

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

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  }

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}

              {/* REAL LOGOUT BUTTON */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md  py-2 text-left hover:bg-red-200 dark:hover:bg-neutral-700"
              >
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                <span className="text-sm text-neutral-800 dark:text-neutral-100">Logout</span>
              </button>
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name ?? "User",
                href: "#",
                icon: (
                  <img
                    src={user.image ?? "https://assets.aceternity.com/manu.png"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard />
    </div>
  );
}

export const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre font-medium text-black dark:text-white">
      Acet Labs
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

const Dashboard = () => {
  // put your real data here; if [] => you’ll see the empty state
  const resumes = [
    { id: "1", companyName: "Google",   jobTitle: "Software Engineer", feedback: { overallScore: 45 }, imagePath: "/cvs/cv1.jpg" },
    { id: "2", companyName: "Facebook", jobTitle: "Product Manager",   feedback: { overallScore: 40 }, imagePath: "/cvs/cv2.jpg" },
    { id: "3", companyName: "Twitter",  jobTitle: "Data Scientist",    feedback: { overallScore: 42 }, imagePath: "/cvs/cv3.jpg" },
    { id: "4", companyName: "LinkedIn", jobTitle: "UX Designer",       feedback: { overallScore: 48 }, imagePath: "/cvs/cv4.jpg" },
  ];

  function handleAnalyze(id: string) {
    // wire this to your analyze flow (Puter AI / API route)
    console.log("Analyze resume:", id);
  }

  if (!resumes.length) {
    return (
      <div className="flex w-full flex-1 items-center justify-center p-6">
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-700">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            You haven’t analyzed any CVs yet
          </h2>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            Upload a CV to get ATS score, key skills, and improvement tips.
          </p>
          <button className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
            Upload CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-4 p-3 md:p-6 bg-white">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Analyze your CV
        </h1>
        {/* Optional: global Upload button */}
        <button className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
          Upload CV
        </button>
      </header>

      {/* Responsive grid with smaller cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {resumes.map((r) => (
          <div key={r.id} className="min-w-[220px]">
            <ResumeCard resume={r} />
          </div>
        ))}
      </div>
    </section>
  );
};

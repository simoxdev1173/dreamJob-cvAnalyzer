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
  IconFileUpload,
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

  // Updated links to include the new Profile page
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard", // Use actual paths
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "/profile", // Link to the new profile page
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-50 md:flex-row dark:border-neutral-800 dark:bg-neutral-900"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
              >
                <IconArrowLeft className="h-5 w-5 shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.name ?? "User",
                href: "/profile",
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
    <a href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
        <img src="/cvdreamjobnoslogan-logo.svg" alt="Cv DreamJob" className="h-8 w-8 shrink-0" />
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre text-lg font-bold text-black dark:text-white">
            Cv DreamJob
        </motion.span>
    </a>
);

export const LogoIcon = () => (
    <a href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
        <img src="/cvdreamjobnoslogan-logo.svg" alt="Cv" className="h-8 w-8 shrink-0" />
    </a>
);

const Dashboard = () => {
  const router = useRouter();
  // Set resumes to [] to test the empty state
  // const resumes: any[] = [];
  const resumes = [
    { id: "1", companyName: "Google",   jobTitle: "Software Engineer", feedback: { overallScore: 45 }, imagePath: "/cvs/cv1.jpg" },
    { id: "2", companyName: "Facebook", jobTitle: "Product Manager",   feedback: { overallScore: 40 }, imagePath: "/cvs/cv2.jpg" },
    { id: "3", companyName: "Twitter",  jobTitle: "Data Scientist",    feedback: { overallScore: 42 }, imagePath: "/cvs/cv3.jpg" },
    { id: "4", companyName: "LinkedIn", jobTitle: "UX Designer",       feedback: { overallScore: 48 }, imagePath: "/cvs/cv4.jpg" },
  ];

  // Improved "Empty State" component
  if (!resumes.length) {
    return (
      <div className="flex w-full flex-1 items-center justify-center bg-white p-6 dark:bg-neutral-900">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-neutral-800">
            <IconFileUpload className="h-10 w-10 text-gray-500 dark:text-neutral-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            No CVs Analyzed Yet
          </h2>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            Get started by uploading your first CV to receive an ATS score, identify key skills, and get valuable improvement tips.
          </p>
          <button
            onClick={() => router.push('/upload-cv')}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Upload Your First CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-6 bg-white p-4 md:p-6 dark:bg-neutral-900">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Your Analyzed CVs
        </h1>
        <button
          onClick={() => router.push('/upload-cv')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Upload New CV
        </button>
      </header>
      {/* More compact and responsive grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resumes.map((r) => (
          <div key={r.id} className="min-w-[200px]">
            <ResumeCard resume={r} />
          </div>
        ))}
      </div>
    </section>
  );
};

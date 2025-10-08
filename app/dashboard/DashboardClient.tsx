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

// Dummy dashboard content
const Dashboard = () => (
  <div className="flex flex-1">
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex gap-2">
        {[...new Array(4)].map((_, idx) => (
          <div key={"first-array-demo-1" + idx} className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        ))}
      </div>
      <div className="flex flex-1 gap-2">
        {[...new Array(2)].map((_, idx) => (
          <div key={"second-array-demo-1" + idx} className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        ))}
      </div>
    </div>
  </div>
);

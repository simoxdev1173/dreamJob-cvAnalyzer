import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Image from "next/image";
import { NavbarH } from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import ButtonMain from "../components/ButtonMain";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/"); // or "/" to send them home

  return (
  <div className="font-sans grid  min-h-screen pb-10 gap-16">
         <header>
            <NavbarH />
          </header>
        <main className="flex flex-col gap-[6px] row-start-2 items-center ">
         
           <div className="text-center z-10">
            <h1 className="text-4xl font-bold">
              This is Dashboard page 
            </h1>
          
            </div>
    
        
        
          </main>
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
  );
}

import Image from "next/image";
import { NavbarH } from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import ButtonMain from "./components/ButtonMain";
export default function Home() {
  return (
    
    <div className="font-sans grid  min-h-screen p-8 pb-10 gap-16 sm:p-20">
       <header>
          <NavbarH />
        </header>
      <main className="flex flex-col gap-[6px] row-start-2 items-center ">
       
         <div className="text-center z-10">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-blue-600">dreamJob</span>
          </h1>
          <p className="mt-4 text-lg">
            Analyze your CV and get insights to improve it.
          </p>
        </div>

       
     <div className="relative w-full h-[400px] flex justify-center">
          <HeroCarousel />
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-6">
        <p className="text-center text-balance text-gray-600">
          Upload your CV and let our AI analyze it for you. Get personalized feedback and tips to enhance your resume .
        </p>
        <ButtonMain text="Upload CV" />
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

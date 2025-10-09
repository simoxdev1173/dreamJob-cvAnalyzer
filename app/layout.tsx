import type { Metadata } from "next";
import localFont from "next/font/local"; 
import "./globals.css";

// Configure your local font
const excon =localFont({
  src : './fonts/excon/Excon-Medium.woff2',
  variable: '--font-excon',
});
const ranade = localFont({
  src: './fonts/ranade/Ranade-Light.woff2', 
  variable: '--font-ranade', 
});
export const metadata: Metadata = {
  title: "dreamJob Your Cv Anlyzer",
  description: "Analyze your CV and get insights to improve it.",
  icons: {
    icon: "/cvdreamjobnoslogan-logo.svg",          
    shortcut: "/cvdreamjobnoslogan-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${ranade.variable}  ${excon.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Discord Bot Creator - BotForgeX",
  description: "Generate working Discord.js bots instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#030303] text-white antialiased min-h-screen relative`}>
        
        {/* SHARED NAVBAR */}
        <Navbar />

        {/* --- THE NEBULA CHROMATIC BACKGROUND (PERSISTENT) --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
        </div>

        {/* PAGE CONTENT */}
        <main className="relative z-10">
          {children}
        </main>

        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
          .animate-pulse {
            animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </body>
    </html>
  );
}

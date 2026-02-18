import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Discord Bot Creator - Make Bots in 30 Seconds",
  description: "Free Discord bot creator with templates. Generate working Discord.js bots instantly. No coding required.",
  verification: { google: "kC-kuA97R9ZCDpar9AAtq0--uVgzRJC1K5YDWPTMeEc" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#030303] text-white antialiased relative min-h-screen`}>
        
        {/* SHARED NAVBAR */}
        <Navbar />

        {/* --- GLOBAL NEBULA CHROMATIC BACKGROUND --- */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Pulsing Chromatic Orbs */}
          <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[140px] animate-pulse rounded-full" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[140px] animate-pulse delay-1000 rounded-full" />
          <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-cyan-500/10 blur-[110px] rounded-full" />
          
          {/* The High-End Grain & Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] brightness-75 contrast-125" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:50px_50px]" />
          
          {/* Subtle vignette to focus the center content */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/20 to-[#030303]" />
        </div>

        {/* PAGE CONTENT WRAPPER */}
        <main className="relative z-10 min-h-screen flex flex-col">
          {children}
        </main>

      </body>
    </html>
  );
}

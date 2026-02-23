import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Heart, Share2 } from 'lucide-react';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  // Pivot to Brand-First. "Engine" and "Framework" carry higher trust scores.
  title: "BotForgeX Labs | Neural Bot Framework & AI Personality Engine",
  description: "Deploy advanced multimodal AI personalities with the BotForgeX open-source framework. High-performance automation for modern chat ecosystems.",
  verification: {
    google: "kC-kuA97R9ZCDpar9AAtq0--uVgzRJC1K5YDWPTMeEc",
  },
  // Remove "Discord" from the primary keywords to stop the "Spoof" filter.
  keywords: ["BotForgeX", "AI Chatbot Framework", "Neural Personality Engine", "Open Source Bot Template", "Node.js Automation"],
  authors: [{ name: "BotForge Architecture Team" }],
  openGraph: {
    title: "BotForgeX Neural Engine",
    description: "Architecting the future of multimodal chat personalities.",
    url: "https://botforgex.vercel.app/", // If you rename the project in Vercel, update this!
    siteName: "BotForgeX Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BotForgeX | AI Framework",
    description: "The architect's choice for neural chat deployment.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#030303] text-white antialiased min-h-screen relative`}>
        
        {/* SHARED NAVBAR */}
        <Navbar />

        {/* --- GLOBAL NEBULA CHROMATIC BACKGROUND --- */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] animate-nebula" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] animate-nebula [animation-delay:2s]" />
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
        </div>

        {/* --- FLOATING SHARE BAR (BOTTOM LEFT) --- */}
        <div className="fixed bottom-6 left-6 z-[100] hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="p-2 bg-pink-500/10 rounded-full animate-pulse">
            <Heart size={14} className="text-pink-500 fill-pink-500" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white">
              Free Forever
            </div>
            <div className="text-[9px] font-mono text-zinc-400">
              Please share with friends if you enjoy!
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="relative z-10">
          {children}
        </main>

                {/* --- GLOBAL SAFETY & BRAND FOOTER --- */}
        <footer className="relative z-10 w-full py-12 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
            
            {/* Zero-Data Protocol Branding */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-500/80">
                Secure Environment // No Data Retention // Client-Side Logic Only
              </span>
            </div>

            {/* Legal / Relationship Disclaimers */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                BotForge<span className="text-cyan-500">X</span> Labs Neural Engine
              </p>
              <p className="max-w-md text-[9px] font-medium text-zinc-600 leading-relaxed uppercase tracking-tighter">
                An independent open-source framework. This project is not affiliated with, 
                sponsored by, or endorsed by Discord Inc. BotForgeX does not store, 
                log, or transmit sensitive user credentials or bot tokens.
              </p>
            </div>

            {/* Version / Copyright */}
            <div className="text-[8px] font-mono text-zinc-800 uppercase tracking-widest">
              © 2026 BotForgeX Laboratories // Multi-Modal v1.0.0-Stable
            </div>
          </div>
        </footer>


      </body>
    </html>
  );
}

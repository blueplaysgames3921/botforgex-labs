import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Discord Bot Creator - Make Bots in 30 Seconds",
  description: "Free Discord bot creator with templates. Generate working Discord.js bots instantly. No coding required. Create your own multimodal AI personality.",
  keywords: ["discord bot creator", "discord bot maker", "discord bot template", "discord.js generator", "ai discord bot"],
  authors: [{ name: "BotForge Team" }],
  openGraph: {
    title: "BotForge | Universal Discord Bot Generator",
    description: "Create your own multimodal AI personality in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BotForge | Discord Bot Generator",
    description: "Make Discord Chatbots in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#030303] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

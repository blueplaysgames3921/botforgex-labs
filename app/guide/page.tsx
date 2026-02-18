import { ShieldCheck, Key, Terminal, Cpu, Globe } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen text-white p-8 md:p-16 font-sans relative z-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-2">Technical Documentation</h1>
          <p className="text-cyan-400 font-mono text-xs tracking-[0.3em]">BotForgeX Deployment Protocols</p>
        </header>

        <section className="grid gap-8">
          <GuideStep 
            icon={<Key className="text-purple-400"/>}
            title="Credential Acquisition"
            desc="You must obtain a Discord Bot Token via the Developer Portal. Enable all 'Privileged Gateway Intents' (Message Content, Server Members) or your bot will be deaf and blind."
            link="https://discord.com/developers/applications"
          />
          <GuideStep 
            icon={<Cpu className="text-cyan-400"/>}
            title="Pollinations AI Integration"
            desc="BotForgeX uses the Pollinations API for multimodal intelligence. Ensure your API key is active to enable Vision and Imaging subroutines."
            link="https://pollinations.ai"
          />
          <GuideStep 
            icon={<Terminal className="text-emerald-400"/>}
            title="Node.js Environment"
            desc="Ensure Node.js v18 or higher is installed. The engine relies on discord.js v14 and msedge-tts for neural voice synthesis."
            link="https://nodejs.org"
          />
        </section>
      </div>
    </div>
  );
}

function GuideStep({ icon, title, desc, link }: any) {
  return (
    <div className="p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-cyan-500/20 transition-all group">
      <div className="flex items-start gap-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">{icon}</div>
        <div className="space-y-3">
          <h3 className="text-lg font-black uppercase italic tracking-wider">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-mono">{desc}</p>
          <a href={link} target="_blank" className="inline-block text-[10px] font-black text-cyan-500 hover:text-white transition-colors uppercase tracking-widest pt-2">Access Resource →</a>
        </div>
      </div>
    </div>
  );
}

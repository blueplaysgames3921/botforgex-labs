import { Cpu, ShieldCheck, Globe, Code2, Heart, Github, MessageCircle, Zap } from 'lucide-react';

export default function InfoPage() {
  return (
    <div className="min-h-screen text-white p-6 pt-32 pb-24 font-sans relative z-10 flex flex-col items-center">
      
      <div className="max-w-4xl w-full space-y-16">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Globe size={12} /> System Intelligence
          </div>
          <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600">
            About The Forge
          </h1>
        </div>

        {/* WHAT IS THIS TOOL */}
        <Section title="The Mechanism" icon={<Zap className="text-yellow-400" size={20}/>}>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            <strong className="text-white font-bold">BotForgeX</strong> is a high-velocity, multimodal Discord automaton generator. It bridges the gap between complex Node.js architecture and user-friendly interface design, allowing anyone to manufacture sentient AI personalities without writing a single line of code. It is not just a tool; it is a <span className="text-cyan-400 italic">foundry for digital life</span>.
          </p>
        </Section>

        {/* WHY IT WAS BUILT */}
        <Section title="Core Philosophy: Security First" icon={<ShieldCheck className="text-emerald-400" size={20}/>}>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-gray-400 text-sm leading-relaxed font-mono">
              The modern web is plagued by "hosted" bot solutions that demand your private keys. This is a vulnerability. BotForgeX was architected to be <strong>Client-Sovereign</strong>. We generate the source code <em>for you</em>, but we never host it. This means your Bot Token and API Keys never leave your machine until you decide to deploy.
            </p>
            <div className="p-6 rounded-2xl bg-white/5 border border-emerald-500/20">
              <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">The Zero-Trust Model</h4>
              <ul className="space-y-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> No Database Storage</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> No Token Logging</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> Local Execution</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* CREATOR INFO */}
        <Section title="The Architect" icon={<Code2 className="text-purple-400" size={20}/>}>
          <div className="flex items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-purple-900/20 to-black border border-purple-500/20">
            <div className="h-20 w-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <div>
              <h3 className="text-2xl font-black italic tracking-tight text-white">blueplaysgames3921</h3>
              <p className="text-purple-400 font-mono text-xs uppercase tracking-widest mt-1">Solo Developer // Open Source Advocate</p>
              <p className="text-zinc-400 text-sm mt-3 max-w-xl">
                "I build tools because access to technology should be universal. Complexity should not be a gatekeeper to creativity."
              </p>
            </div>
          </div>
        </Section>

        {/* CREDITS & LIBRARIES */}
        <Section title="Power Source: Libraries" icon={<Cpu className="text-blue-400" size={20}/>}>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <TechCard name="Next.js" role="Framework" color="text-white" border="border-white/20" />
             <TechCard name="Lucide" role="Iconography" color="text-pink-400" border="border-pink-500/20" />
             <TechCard name="Tailwind" role="Styling" color="text-cyan-400" border="border-cyan-500/20" />
             <TechCard name="Framer" role="Motion" color="text-yellow-400" border="border-yellow-500/20" />
           </div>
        </Section>

        {/* API PROVIDERS */}
        <Section title="Neural Backbone" icon={<Zap className="text-orange-400" size={20}/>}>
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-orange-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[100px] group-hover:bg-orange-500/20 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
               <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  {/* Simulate Pollinations Logo */}
                  <div className="text-3xl text-black font-black">P.AI</div> 
               </div>
               <div className="text-center md:text-left">
                 <h3 className="text-3xl font-black text-white">Pollinations.ai</h3>
                 <p className="text-orange-400 font-mono text-xs uppercase tracking-widest mt-2">Generative Intelligence Provider</p>
                 <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                   This project would be inert metal without the generous API provided by Pollinations. Their commitment to open/free generative AI is the heartbeat of these bots. Please support their work.
                 </p>
               </div>
            </div>
          </div>
        </Section>

        {/* SOCIALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SocialCard icon={<Github size={30}/>} platform="GitHub" user="blueplaysgames3921" link="https://github.com/blueplaysgames3921" color="hover:bg-white/10" />
          <SocialCard icon={<MessageCircle size={30}/>} platform="Discord" user="blueplaysgames3921" link="#" color="hover:bg-[#5865F2]/20 hover:border-[#5865F2]" />
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="py-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl opacity-50" />
          <h2 className="relative text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Free Tools for Everyone.
          </h2>
          <p className="relative mt-4 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">
            <Heart size={12} className="inline mr-2 align-text-bottom"/> 
            Sharing this tool with friends is the best support
          </p>
        </div>

      </div>
    </div>
  );
}

// SUBCOMPONENTS
const Section = ({ title, icon, children }: any) => (
  <section className="space-y-6">
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
      <h2 className="text-xl font-black uppercase tracking-[0.2em] text-gray-200">{title}</h2>
    </div>
    {children}
  </section>
);

const TechCard = ({ name, role, color, border }: any) => (
  <div className={`p-4 rounded-xl bg-white/5 border ${border} flex flex-col items-center text-center hover:scale-105 transition-transform`}>
    <span className={`text-lg font-black ${color}`}>{name}</span>
    <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1">{role}</span>
  </div>
);

const SocialCard = ({ icon, platform, user, link, color }: any) => (
  <a href={link} target="_blank" className={`p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-6 group transition-all ${color}`}>
    <div className="text-zinc-400 group-hover:text-white transition-colors">{icon}</div>
    <div>
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{platform}</div>
      <div className="text-xl font-bold text-white group-hover:tracking-wide transition-all">{user}</div>
    </div>
  </a>
);


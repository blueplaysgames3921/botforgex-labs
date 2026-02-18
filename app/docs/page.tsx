import { FileCode2, Layers, Box, Terminal, Database, Cpu } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen text-white p-6 pt-32 pb-24 font-sans relative z-10 flex justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SIDEBAR NAVIGATION (Visual Only) */}
        <div className="hidden lg:block space-y-8 sticky top-32 h-fit">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Table of Contents</div>
          <ul className="space-y-4 text-sm font-mono text-zinc-400">
            <li className="text-cyan-400 font-bold border-l-2 border-cyan-500 pl-4">01. Architecture</li>
            <li className="hover:text-white pl-4 transition-colors cursor-not-allowed opacity-50">02. File Structure</li>
            <li className="hover:text-white pl-4 transition-colors cursor-not-allowed opacity-50">03. Customization</li>
            <li className="hover:text-white pl-4 transition-colors cursor-not-allowed opacity-50">04. API Ref</li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-16">
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Technical Documentation</h1>
            <p className="text-purple-400 font-mono text-xs uppercase tracking-[0.2em]">Build v1.0.0 // Stable Release</p>
          </div>

          {/* SECTION 1: ARCHITECTURE */}
          <div className="space-y-6">
            <SectionHeader number="01" title="System Architecture" icon={<Layers className="text-cyan-400"/>} />
            <p className="text-gray-400 leading-relaxed font-light">
              The BotForgeX output is a lightweight Node.js application centered around the <code className="bg-white/10 px-1 rounded text-white">discord.js</code> library (v14+). It utilizes an event-driven architecture where the `messageCreate` event acts as the primary trigger for the neural subroutines.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <SpecCard title="Runtime" val="Node.js v18+" icon={<Terminal size={14}/>} />
              <SpecCard title="LLM Provider" val="Pollinations.ai (OpenAI/Gemini)" icon={<Cpu size={14}/>} />
              <SpecCard title="Voice Engine" val="Edge-TTS (Neural)" icon={<Database size={14}/>} />
              <SpecCard title="Latency" val="~800ms Avg" icon={<Zap size={14}/>} />
            </div>
          </div>

          {/* SECTION 2: FILE STRUCTURE */}
          <div className="space-y-6">
            <SectionHeader number="02" title="File Anatomy" icon={<FileCode2 className="text-emerald-400"/>} />
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 font-mono text-xs space-y-4">
               <FileTree name="index.js" desc="The Core Brain. Handles event listeners, API calls, and context management." color="text-yellow-400" />
               <FileTree name=".env" desc="Security Layer. Stores BOT_TOKEN and POLLINATIONS_KEY." color="text-red-400" />
               <FileTree name="package.json" desc="Dependency Manifest. Defines required libraries." color="text-purple-400" />
            </div>
          </div>

          {/* SECTION 3: EXTENDING */}
          <div className="space-y-6">
            <SectionHeader number="03" title="Extensibility" icon={<Box className="text-pink-400"/>} />
            <p className="text-gray-400 leading-relaxed">
              The generated code is intentionally unminified and commented. To add new commands, you can simply inject standard <code className="bg-white/10 px-1 rounded text-white">if (msg.content === '!cmd')</code> blocks inside the event listener. The state is ephemeral; for long-term memory, integration with a database like MongoDB or SQLite is recommended.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// DOCS COMPONENTS
import { Zap } from 'lucide-react';

const SectionHeader = ({ number, title, icon }: any) => (
  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
    <span className="text-3xl font-black text-white/10">{number}</span>
    <div className="h-8 w-[1px] bg-white/10" />
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-xl font-bold uppercase tracking-widest text-white">{title}</h2>
    </div>
  </div>
);

const SpecCard = ({ title, val, icon }: any) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
      {icon} {title}
    </span>
    <span className="text-sm font-mono text-cyan-400">{val}</span>
  </div>
);

const FileTree = ({ name, desc, color }: any) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
    <span className={`font-bold ${color} shrink-0 w-32`}>{name}</span>
    <span className="text-zinc-600">// {desc}</span>
  </div>
);


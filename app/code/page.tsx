import { Github, ExternalLink, ShieldCheck, Box } from 'lucide-react';

export default function CodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
      <div className="max-w-2xl w-full p-12 rounded-[40px] bg-[#080808] border border-white/5 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_#06b6d4]" />
        
        <div className="inline-flex p-5 rounded-3xl bg-white/5 border border-white/10 mb-4">
          <Github size={48} className="text-white" />
        </div>
        
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Template Repository</h2>
        <p className="text-zinc-500 font-mono text-sm leading-relaxed">
          The underlying multimodal engine is open-source. Access the raw logic, contribute to the neural core, or audit the code for security compliance.
        </p>
        
        <a 
          href="https://github.com/blueplaysgames3921/multimodal-discord-chatbot-template"
          target="_blank"
          className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black font-black uppercase italic tracking-[0.2em] hover:bg-cyan-500 transition-all group"
        >
          View GitHub Source <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

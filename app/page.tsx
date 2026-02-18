'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Check, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, Layers, 
  Activity, ShieldCheck, HardDrive, Share2, Code2, Wifi,
  Settings, Target, Fingerprint, Radar, Gauge, ChevronRight, X
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotForgePremium() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM]: Kernel Loaded.', '[SYSTEM]: Awaiting operator...']);
  
  const [formData, setFormData] = useState({
    botName: '', personaRaw: '', backstoryRaw: '', likes: '', dislikes: '',
    hobbies: '', likedUsers: '', minRange: 5, maxRange: 15,
    enableImage: true, enableVision: true, enableTTS: true, casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev.slice(-12), `[LOG]: ${msg}`]);

  const callAI = async (prompt: string, type: 'prompt' | 'story') => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type })
    });
    const data = await res.json();
    return data.content || prompt;
  };

  const handleGenerate = async () => {
    if (!formData.botName || !formData.personaRaw) return alert("Designation and Persona required.");
    setLoading(true); setGenerated(false);
    updateLog(`UPLINKING: ${formData.botName.toUpperCase()}...`);

    try {
      const finalSysPrompt = await callAI(`Character: ${formData.personaRaw}. Style: Discord Bot.`, 'prompt');
      updateLog('NEURAL PROMPT GENERATED.');
      
      const finalBackstory = await callAI(`Backstory for: ${formData.backstoryRaw || formData.personaRaw}`, 'story');
      updateLog('LORE FRAGMENTS SYNTHESIZED.');

      const envContent = `# CREDENTIALS\nBOT_TOKEN=\nPOLLINATIONS_KEY=\nOWNER_ID=\nSERVER_ID=\n\n# IDENTITY\nBOT_NAME="${formData.botName}"\nSYSTEM_PROMPT="${finalSysPrompt}"\nBACKSTORY="${finalBackstory}"\nHOBBIES="${formData.hobbies}"\nDISLIKES="${formData.dislikes}"\nLIKED_USERS="${formData.likedUsers}"\nCREATIVITY_LEVEL=0.75\nCASUAL_MODE=${formData.casualMode}\n\n# BEHAVIOR\nNATURAL_MIN=${formData.minRange}\nNATURAL_MAX=${formData.maxRange}\nENABLE_IMAGE_GEN=${formData.enableImage}\nENABLE_VISION=${formData.enableVision}\nENABLE_TTS=${formData.enableTTS}`;

      const zip = new JSZip();
      zip.file("package.json", PACKAGE_JSON);
      zip.file("index.js", INDEX_JS);
      zip.file("README.md", README_MD);
      zip.file("env.txt", envContent.trim());
      zip.file(".gitignore", "node_modules\n.env");

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${formData.botName}_CORE.zip`);
      setGenerated(true);
      updateLog('CORE ARCHIVE GENERATED.');
    } catch (e) {
      updateLog('FATAL: COMPILATION ERROR.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 p-4 md:p-12 font-sans relative overflow-hidden">
      {/* GLOBAL OVERLAYS */}
      <div className="fixed inset-0 bg-grid-white pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-[0.05]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-10">
          <header className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl group-hover:bg-cyan-500/40 transition-all" />
              <div className="h-20 w-20 bg-black border-2 border-white/10 rounded-[2rem] flex items-center justify-center relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <Fingerprint className="text-cyan-400 group-hover:scale-110 transition-transform" size={40} />
              </div>
            </div>
            <div>
              <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none text-white selection:bg-cyan-500 selection:text-black">
                BotForge<span className="text-cyan-500 font-normal ml-1">.SYS</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-[10px] uppercase font-mono tracking-[0.6em] text-zinc-600 flex items-center gap-2">
                  <Activity size={12} className="text-emerald-500 animate-pulse" /> Connection Secure
                </p>
                <div className="h-px w-20 bg-zinc-800" />
                <p className="text-[10px] uppercase font-mono tracking-[0.4em] text-zinc-400 italic">Premium Build</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <Section title="Identity Parameters" icon={<Settings size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Input label="Bot Callsign" ph="e.g. GHOST-6" val={formData.botName} set={(v: string) => setFormData({...formData, botName: v})} />
                <Input label="Persona Base" ph="e.g. Grumpy Mechanic" val={formData.personaRaw} set={(v: string) => setFormData({...formData, personaRaw: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-zinc-500 tracking-widest ml-1">Backstory Override</label>
                <textarea className="premium-area h-32" placeholder="Force a specific history... Or leave empty for AI synthesis."
                   value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
              </div>
            </Section>

            <Section title="Social Weights" icon={<Target size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Inclinations" ph="Code, Caffeine" val={formData.likes} set={(v: string) => setFormData({...formData, likes: v})} />
                <Input label="Triggers" ph="Slow Internet" val={formData.dislikes} set={(v: string) => setFormData({...formData, dislikes: v})} />
                <Input label="Side Tasks" ph="Data Mining" val={formData.hobbies} set={(v: string) => setFormData({...formData, hobbies: v})} />
                <Input label="Priority User IDs" ph="1234, 5678" val={formData.likedUsers} set={(v: string) => setFormData({...formData, likedUsers: v})} />
              </div>
            </Section>

            <Section title="Neural Logic" icon={<Gauge size={18} />}>
              <div className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">Messaging Entropy</span>
                  <span className="text-xl font-mono text-cyan-400">{formData.minRange}-{formData.maxRange}</span>
                </div>
                <div className="flex gap-6">
                  <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="flex-1 accent-cyan-500" />
                  <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="flex-1 accent-cyan-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Toggle label="Vision" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
                <Toggle label="Image Gen" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
                <Toggle label="TTS Output" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
                <Toggle label="Casualty" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
              </div>
            </Section>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-8 rounded-[2.5rem] bg-white text-black font-black text-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-6 group disabled:opacity-50 relative overflow-hidden active:scale-[0.98]"
          >
            {loading ? <Cpu className="animate-spin" /> : <Download className="group-hover:translate-y-2 transition-transform" />}
            <span className="uppercase tracking-[0.2em] italic underline decoration-black/20">Compile Core Archive</span>
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[400px]">
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-8">
              <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                <Terminal size={14} className="text-cyan-500" /> live_compiler.sys
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>
            <div className="p-8 font-mono text-[11px] text-cyan-400/80 space-y-2 overflow-y-auto scrollbar-hide">
              {logs.map((log, i) => <div key={i} className="flex gap-4"><span className="text-zinc-800 shrink-0">{i.toString().padStart(2, '0')}</span> {log}</div>)}
              {loading && <div className="animate-pulse bg-cyan-400 w-2 h-4" />}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                <div className="bg-[#111] border-2 border-white/5 p-8 rounded-[3rem] space-y-6">
                  <h3 className="text-white font-black text-sm flex items-center gap-3 uppercase italic tracking-widest underline decoration-cyan-500 decoration-2">
                    <Key size={20} className="text-cyan-500" /> Final Integration
                  </h3>
                  <div className="space-y-4">
                    <GuideLink label="Discord Token" desc="Portal > Bot > Reset Token" />
                    <GuideLink label="Admin ID" desc="Advanced > Dev Mode > Copy User ID" />
                    <GuideLink label="API Key" desc="Get key at pollinations.ai" />
                  </div>
                </div>
                
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[3rem] flex items-start gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={60} /></div>
                  <div className="h-10 w-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20">
                    <X className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h4 className="text-red-500 font-black uppercase text-xs tracking-widest italic mb-2">Renaming Required</h4>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">
                      Locate <span className="text-white font-mono">env.txt</span> in the archive and rename it to <span className="text-white font-mono">.env</span>. The bot core will not ignite without this step.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3.5rem] space-y-10 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <Radar className="text-emerald-500" size={24} />
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] italic">Launch Protocol</h3>
                  </div>
                  <div className="space-y-10">
                    <Step n="01" t="Initialization" d="Extract the core archive to a dedicated directory." />
                    <Step n="02" t="Dependencies" d="npm install - Run this in your terminal to fetch the binary logic." />
                    <Step n="03" t="Ignition" d="node index.js - The bot is now live and patrolling the server." />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .premium-area { @apply w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] p-6 text-sm focus:border-cyan-500/50 transition-all outline-none resize-none font-mono text-zinc-400 placeholder:text-zinc-800; }
        .bg-grid-white { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.02)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E"); }
        .scanline { background: linear-gradient(to bottom, transparent 50%, black 50%); background-size: 100% 4px; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// TYPED COMPONENTS
const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <section className="bg-zinc-900/20 border border-white/5 p-10 rounded-[3.5rem] relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-10 text-white/[0.02] group-hover:text-cyan-500/[0.05] transition-colors">{icon}</div>
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">{title}</h2>
    </div>
    {children}
  </section>
);

const Input = ({ label, val, set, ph }: { label: string, val: string, set: (v: string) => void, ph: string }) => (
  <div className="space-y-3 flex-1">
    <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest ml-1">{label}</label>
    <input type="text" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-cyan-500/40 outline-none transition-all text-white placeholder:text-zinc-800" 
      placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const Toggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={clsx("py-6 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 border transition-all active:scale-95", active ? "bg-white text-black border-white" : "bg-black text-zinc-700 border-white/5 hover:border-white/10")}>
    <div className={clsx("h-1 w-8 rounded-full", active ? "bg-cyan-500" : "bg-zinc-900")} />
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const GuideLink = ({ label, desc }: { label: string, desc: string }) => (
  <div className="flex justify-between items-center group py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-all">
    <div>
      <div className="text-white text-[12px] font-black group-hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-3">
        <ChevronRight size={16} className="text-zinc-800 group-hover:text-cyan-500 transition-all" /> {label}
      </div>
      <div className="text-[9px] font-mono text-zinc-600 mt-1 ml-7 tracking-tighter uppercase">{desc}</div>
    </div>
    <Box size={16} className="text-zinc-800 group-hover:text-cyan-400" />
  </div>
);

const Step = ({ n, t, d }: { n: string, t: string, d: string }) => (
  <div className="flex gap-8 group">
    <div className="text-4xl font-black text-zinc-900 group-hover:text-cyan-500/20 transition-colors font-mono italic leading-none">{n}</div>
    <div>
      <h5 className="text-white text-xs font-black uppercase italic tracking-[0.3em]">{t}</h5>
      <p className="text-zinc-500 text-[10px] font-mono mt-2 leading-relaxed group-hover:text-zinc-300 transition-colors">{d}</p>
    </div>
  </div>
);

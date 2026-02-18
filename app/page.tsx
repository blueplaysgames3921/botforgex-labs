'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Check, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, Layers, 
  Activity, ShieldCheck, HardDrive, Share2, Code2, Wifi,
  Settings, Target, Fingerprint, Radar, Gauge, ChevronRight
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotForgePremium() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM]: Kernel v2.0.4 loaded.', '[SYSTEM]: Awaiting operator input...']);
  
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
    if (!formData.botName || !formData.personaRaw) return alert("Callsign and Persona required.");
    setLoading(true); setGenerated(false);
    updateLog(`ACCESSING NEURAL UPLINK FOR ${formData.botName.toUpperCase()}...`);

    try {
      const finalSysPrompt = await callAI(`Character: ${formData.personaRaw}. Style: Discord Bot.`, 'prompt');
      updateLog('SYNPATIC PROMPT COMPILED.');
      
      const finalBackstory = await callAI(`Backstory for: ${formData.backstoryRaw || formData.personaRaw}`, 'story');
      updateLog('HISTORY LOGS SYNTHESIZED.');

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
      updateLog('PACKAGE READY FOR DEPLOYMENT.');
    } catch (e) {
      updateLog('FATAL: NEURAL SYNC FAILURE.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 p-4 md:p-12 font-sans relative overflow-hidden">
      {/* PREMIUM ACCESSORIES */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute inset-0 bg-grid-white pointer-events-none" />
      
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 opacity-[0.03]">
        <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,black_50%)] bg-[size:100%_4px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-7 space-y-8">
          <header className="flex items-center gap-6">
            <div className="relative h-20 w-20 flex items-center justify-center group">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform border border-cyan-500/20" />
              <div className="absolute inset-0 bg-black border border-white/10 rounded-2xl" />
              <Fingerprint className="text-cyan-400 relative z-10" size={38} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#020203] animate-pulse" />
            </div>
            <div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                BotForge<span className="text-cyan-500 italic">.v2</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="h-px w-8 bg-zinc-800" />
                <p className="text-[10px] uppercase font-mono tracking-[0.5em] text-zinc-500 flex items-center gap-2">
                  <Radar size={12} className="text-cyan-500 animate-spin-slow" /> System-ID: 882-XQ
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-4">
            <Card title="Neural Designation" icon={<Settings size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Callsign" ph="e.g. OMEGA-9" val={formData.botName} set={(v: string) => setFormData({...formData, botName: v})} />
                <Input label="Persona Vector" ph="e.g. Sarcastic Scholar" val={formData.personaRaw} set={(v: string) => setFormData({...formData, personaRaw: v})} />
              </div>
              <div className="mt-4 relative group">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-500/20 group-focus-within:bg-cyan-500 transition-colors" />
                <textarea className="premium-area h-24" placeholder="Inject custom lore context... (Optional)" value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
              </div>
            </Card>

            <Card title="Behavioral Constants" icon={<Target size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Inclinations" ph="Logic, Clean data" val={formData.likes} set={(v: string) => setFormData({...formData, likes: v})} />
                <Input label="Aversions" ph="Redundancy" val={formData.dislikes} set={(v: string) => setFormData({...formData, dislikes: v})} />
                <Input label="Sub-Routines" ph="Archiving" val={formData.hobbies} set={(v: string) => setFormData({...formData, hobbies: v})} />
                <Input label="Root Access IDs" ph="User IDs" val={formData.likedUsers} set={(v: string) => setFormData({...formData, likedUsers: v})} />
              </div>
            </Card>

            <Card title="Hardware Interface" icon={<Gauge size={18} />}>
              <div className="mb-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">
                  <span className="flex items-center gap-2"><Activity size={12}/> Messaging Frequency</span>
                  <span className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">{formData.minRange}-{formData.maxRange}</span>
                </div>
                <div className="flex gap-4">
                  <input type="range" min="1" max="30" className="flex-1 accent-cyan-500" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} />
                  <input type="range" min="31" max="100" className="flex-1 accent-cyan-500" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniToggle label="Vision" active={formData.enableVision} toggle={() => setFormData({...formData, enableVision: !formData.enableVision})} />
                <MiniToggle label="Images" active={formData.enableImage} toggle={() => setFormData({...formData, enableImage: !formData.enableImage})} />
                <MiniToggle label="Voice" active={formData.enableTTS} toggle={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
                <MiniToggle label="Casual" active={formData.casualMode} toggle={() => setFormData({...formData, casualMode: !formData.casualMode})} />
              </div>
            </Card>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="w-full bg-white hover:bg-cyan-500 text-black font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 group">
            {loading ? <Cpu className="animate-spin" /> : <Download className="group-hover:translate-y-1 transition-transform" />}
            <span className="uppercase tracking-[0.2em] text-lg italic">Compile Core.zip</span>
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black border border-white/10 rounded-[2.5rem] flex flex-col h-[350px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500"><Terminal size={14}/> DEPLOYMENT_LOG</div>
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-zinc-800" /><div className="w-2.5 h-2.5 rounded-full bg-zinc-800" /><div className="w-2.5 h-2.5 rounded-full bg-zinc-800" /></div>
            </div>
            <div className="p-8 mt-12 font-mono text-[11px] text-cyan-400/70 space-y-2 overflow-y-auto scrollbar-hide">
              {logs.map((l, i) => <div key={i} className="flex gap-3"><span className="text-zinc-700">{i}</span> {l}</div>)}
              {loading && <div className="text-white animate-pulse">_ EXECUTING_BUILD...</div>}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><Key size={80}/></div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-cyan-500" /> Integration Keys
                  </h3>
                  <div className="space-y-4">
                    <SetupLink label="Bot Secret" desc="Discord Dev Portal -> Bot" />
                    <SetupLink label="Admin ID" desc="User Settings -> Advanced -> Copy" />
                    <SetupLink label="Pollinations" desc="Get key from pollinations.ai" />
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                   <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12"><Rocket size={250} /></div>
                   <div className="flex items-center gap-3 mb-2">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                     <h4 className="text-emerald-400 font-black uppercase text-xs tracking-[0.4em]">Launch Sequence</h4>
                   </div>
                   <div className="space-y-6">
                     <Step n="01" t="Initialization" d="Extract ZIP, rename env.txt to .env" />
                     <Step n="02" t="Dependencies" d="Run 'npm install' in terminal" />
                     <Step n="03" t="Ignition" d="Run 'node index.js' to start" />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .premium-area { @apply w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm focus:border-cyan-500/30 transition-all outline-none resize-none font-mono text-zinc-400; }
        .bg-grid-white { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.03)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E"); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// FIXING TYPES FOR PRODUCTION BUILD
const Card = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] relative group">
    <div className="absolute top-8 right-8 text-white/5 group-hover:text-cyan-500/10 transition-colors">{icon}</div>
    <div className="flex items-center gap-3 mb-8">
      <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">{title}</h2>
    </div>
    {children}
  </div>
);

const Input = ({ label, ph, val, set }: { label: string, ph: string, val: string, set: (v: string) => void }) => (
  <div className="space-y-3 flex-1">
    <label className="text-[9px] uppercase font-black text-zinc-600 tracking-[0.2em] ml-1">{label}</label>
    <input type="text" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-xs focus:border-cyan-500/40 outline-none transition-all text-white placeholder:text-zinc-700" 
      placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const MiniToggle = ({ label, active, toggle }: { label: string, active: boolean, toggle: () => void }) => (
  <button onClick={toggle} className={clsx("py-5 rounded-2xl flex flex-col items-center justify-center gap-3 border transition-all active:scale-95", active ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "bg-black text-zinc-600 border-white/5 hover:border-white/10")}>
    <div className={clsx("h-1 w-6 rounded-full", active ? "bg-cyan-500" : "bg-zinc-800")} />
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const SetupLink = ({ label, desc }: { label: string, desc: string }) => (
  <div className="flex justify-between items-center group cursor-pointer py-3 border-b border-white/5 last:border-0 hover:px-2 transition-all">
    <div>
      <div className="text-white text-[11px] font-black group-hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-2">
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {label}
      </div>
      <div className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-tighter">{desc}</div>
    </div>
    <Box size={14} className="text-zinc-800 group-hover:text-cyan-400 transition-colors" />
  </div>
);

const Step = ({ n, t, d }: { n: string, t: string, d: string }) => (
  <div className="flex gap-6 group">
    <div className="text-3xl font-black text-zinc-900 group-hover:text-emerald-500/20 transition-colors font-mono">{n}</div>
    <div className="pt-1">
      <h5 className="text-white text-xs font-black uppercase italic tracking-[0.2em]">{t}</h5>
      <p className="text-zinc-500 text-[10px] font-mono mt-1 group-hover:text-zinc-400 transition-colors">{d}</p>
    </div>
  </div>
);

'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Check, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, Layers, 
  Activity, ShieldCheck, HardDrive, Share2, Code2, Wifi,
  Settings, Target, ZapOff, Fingerprint, Radar, Gauge
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotForgePremium() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM]: Kernel Loaded. Wait for input...']);
  const [formData, setFormData] = useState({
    botName: '', personaRaw: '', backstoryRaw: '', likes: '', dislikes: '',
    hobbies: '', likedUsers: '', minRange: 5, maxRange: 15,
    enableImage: true, enableVision: true, enableTTS: true, casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev.slice(-10), `[LOG]: ${msg}`]);

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
    updateLog(`Compiling ${formData.botName}...`);

    try {
      const finalSysPrompt = await callAI(`Character: ${formData.personaRaw}. Style: Discord Bot.`, 'prompt');
      updateLog('Neural prompt generated.');
      
      const finalBackstory = await callAI(`Backstory for: ${formData.backstoryRaw || formData.personaRaw}`, 'story');
      updateLog('Lore sequence established.');

      const envContent = `
# ═══ CREDENTIALS ═══
BOT_TOKEN=
POLLINATIONS_KEY=
OWNER_ID=
SERVER_ID=

# ═══ IDENTITY ═══
BOT_NAME="${formData.botName}"
SYSTEM_PROMPT="${finalSysPrompt}"
BACKSTORY="${finalBackstory}"
HOBBIES="${formData.hobbies}"
DISLIKES="${formData.dislikes}"
LIKED_USERS="${formData.likedUsers}"
CREATIVITY_LEVEL=0.75
CASUAL_MODE=${formData.casualMode}

# ═══ BEHAVIOR ═══
NATURAL_MIN=${formData.minRange}
NATURAL_MAX=${formData.maxRange}
ENABLE_IMAGE_GEN=${formData.enableImage}
ENABLE_VISION=${formData.enableVision}
ENABLE_TTS=${formData.enableTTS}
`;

      const zip = new JSZip();
      zip.file("package.json", PACKAGE_JSON);
      zip.file("index.js", INDEX_JS);
      zip.file("README.md", README_MD);
      zip.file("env.txt", envContent.trim());
      zip.file(".gitignore", "node_modules\n.env");

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${formData.botName}_CORE.zip`);
      setGenerated(true);
      updateLog('Compilation successful.');
    } catch (e) {
      updateLog('Fatal error during build.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-zinc-100 p-6 font-sans relative overflow-hidden">
      {/* ACCESSORIES & BG EFFECTS */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent)]" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pt-10">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-7 space-y-8">
          <header className="flex items-center gap-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 border border-white/10 rounded-3xl -rotate-3" />
              <Fingerprint className="text-cyan-400 relative z-10" size={40} />
            </div>
            <div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Forge<span className="text-cyan-500">.ID</span></h1>
              <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-[0.4em] flex items-center gap-2">
                <Radar size={12} className="text-emerald-500" /> Operational Matrix v2.0.4
              </p>
            </div>
          </header>

          <div className="space-y-4">
            <Card title="Core Definition" icon={<Settings size={18} className="text-blue-400" />}>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Callsign" ph="e.g. OMEGA" val={formData.botName} set={(v) => setFormData({...formData, botName: v})} />
                <Input label="Neural Base" ph="e.g. Rude Sarcastic AI" val={formData.personaRaw} set={(v) => setFormData({...formData, personaRaw: v})} />
              </div>
              <textarea className="premium-area mt-4 h-24" placeholder="Inject custom backstory or leave for AI..." value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
            </Card>

            <Card title="Social Constants" icon={<Target size={18} className="text-yellow-500" />}>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Favors" ph="Coffee, Coding" val={formData.likes} set={(v) => setFormData({...formData, likes: v})} />
                <Input label="Aversions" ph="Loud Noise" val={formData.dislikes} set={(v) => setFormData({...formData, dislikes: v})} />
                <Input label="Hobbies" ph="Data Mining" val={formData.hobbies} set={(v) => setFormData({...formData, hobbies: v})} />
                <Input label="Priority IDs" ph="User IDs" val={formData.likedUsers} set={(v) => setFormData({...formData, likedUsers: v})} />
              </div>
            </Card>

            <Card title="Neural Logic" icon={<Gauge size={18} className="text-emerald-500" />}>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase mb-2"><span>Frequency</span><span>{formData.minRange}-{formData.maxRange}</span></div>
                  <input type="range" min="1" max="50" className="w-full accent-cyan-500" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} />
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

          <button onClick={handleGenerate} disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-widest disabled:opacity-50 group">
            {loading ? <Activity className="animate-spin" /> : <Download className="group-hover:translate-y-1 transition-transform" />}
            {loading ? 'Processing Neural Data...' : 'Compile Production Core'}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-black/60 border border-white/10 rounded-3xl flex-1 flex flex-col overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500"><Terminal size={14}/> TERMINAL_SESSION</div>
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/20" /><div className="w-2 h-2 rounded-full bg-yellow-500/20" /><div className="w-2 h-2 rounded-full bg-emerald-500/20" /></div>
            </div>
            <div className="p-6 font-mono text-[11px] text-cyan-500/80 space-y-1 h-[250px] overflow-y-auto overflow-x-hidden">
              {logs.map((l, i) => <div key={i}>{l}</div>)}
              {loading && <div className="animate-pulse">_ EXEC_PROCESS...</div>}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><KeyLink label="" url="" desc="" /></div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 italic"><Key size={16} className="text-cyan-400"/> Security Setup</h3>
                  <div className="space-y-3">
                    <SetupLink label="Bot Token" desc="Portal -> Bot -> Reset" />
                    <SetupLink label="Owner ID" desc="Right-click user -> Copy ID" />
                    <SetupLink label="Server ID" desc="Right-click server -> Copy ID" />
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 opacity-5"><Rocket size={200} /></div>
                  <h4 className="text-emerald-400 font-black uppercase text-xs tracking-[0.3em] flex items-center gap-2"><Globe size={16}/> Deploy Logic</h4>
                  <div className="space-y-4 relative z-10">
                    <Step n="1" t="Local" d="npm install && node index.js" />
                    <Step n="2" t="Cloud" d="Railway.app -> New Project -> GH" />
                    <Step n="3" t="VPS" d="pm2 start index.js --name 'bot'" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .premium-area { @apply w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-cyan-500/50 transition-all outline-none resize-none font-mono text-zinc-300; }
        .bg-grid-white { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E"); }
      `}</style>
    </div>
  );
}

// SUBCOMPONENTS
const Card = ({ title, icon, children }: any) => (
  <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">{title}</h2>
    </div>
    {children}
  </div>
);

const Input = ({ label, ph, val, set }: any) => (
  <div className="space-y-2 flex-1">
    <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest ml-1">{label}</label>
    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-cyan-500/30 outline-none transition-all text-white" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const MiniToggle = ({ label, active, toggle }: any) => (
  <button onClick={toggle} className={clsx("py-3 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all", active ? "bg-white text-black border-white" : "bg-black/20 text-zinc-600 border-white/5 hover:border-white/10")}>
    <div className={clsx("h-1 w-4 rounded-full", active ? "bg-cyan-500" : "bg-zinc-800")} />
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

const SetupLink = ({ label, desc }: any) => (
  <div className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-2">
    <div>
      <div className="text-white text-[11px] font-bold group-hover:text-cyan-400 transition-colors uppercase italic">{label}</div>
      <div className="text-[9px] font-mono text-zinc-500">{desc}</div>
    </div>
    <Box size={14} className="text-zinc-700 group-hover:text-cyan-400" />
  </div>
);

const Step = ({ n, t, d }: any) => (
  <div className="flex gap-4 group">
    <div className="text-xl font-black text-zinc-800 group-hover:text-emerald-500/20 transition-colors font-mono">{n}</div>
    <div>
      <h5 className="text-white text-[11px] font-black uppercase italic tracking-widest">{t}</h5>
      <p className="text-zinc-500 text-[10px] font-mono mt-0.5">{d}</p>
    </div>
  </div>
);

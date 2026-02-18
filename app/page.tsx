'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, 
  Activity, ShieldCheck, Share2, Code2, 
  Settings, Target, Fingerprint, Radar, Gauge, ChevronRight,
  MessageSquare, Heart, Skull, ZapOff, Ghost
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotForgeUltimate() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM_READY', '> AWAITING_INPUT']);
  
  const [formData, setFormData] = useState({
    botName: '', personaRaw: '', backstoryRaw: '', likes: '', dislikes: '',
    hobbies: '', likedUsers: '', minRange: 5, maxRange: 15,
    enableImage: true, enableVision: true, enableTTS: true, casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev.slice(-8), `> ${msg}`]);

  const callAI = async (prompt: string, type: 'prompt' | 'story') => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type })
      });
      const data = await res.json();
      return data.content || prompt;
    } catch (e) { return prompt; }
  };

  const handleGenerate = async () => {
    if (!formData.botName || !formData.personaRaw) return alert("MISSING CORE DATA");
    setLoading(true); setGenerated(false);
    updateLog(`INITIALIZING CORE: ${formData.botName}...`);

    try {
      const finalSysPrompt = await callAI(`Character: ${formData.personaRaw}. Style: Discord Bot.`, 'prompt');
      updateLog('NEURAL MATRIX ESTABLISHED.');
      
      const finalBackstory = await callAI(`Backstory for: ${formData.backstoryRaw || formData.personaRaw}`, 'story');
      updateLog('HISTORY SYNCHRONIZED.');

      const envContent = `# CREDENTIALS\nBOT_TOKEN=\nPOLLINATIONS_KEY=\nOWNER_ID=\nSERVER_ID=\n\n# IDENTITY\nBOT_NAME="${formData.botName}"\nSYSTEM_PROMPT="${finalSysPrompt}"\nBACKSTORY="${finalBackstory}"\nHOBBIES="${formData.hobbies}"\nDISLIKES="${formData.dislikes}"\nLIKED_USERS="${formData.likedUsers}"\nCREATIVITY_LEVEL=0.75\nCASUAL_MODE=${formData.casualMode}\n\n# BEHAVIOR\nNATURAL_MIN=${formData.minRange}\nNATURAL_MAX=${formData.maxRange}\nENABLE_IMAGE_GEN=${formData.enableImage}\nENABLE_VISION=${formData.enableVision}\nENABLE_TTS=${formData.enableTTS}`;

      const zip = new JSZip();
      zip.file("package.json", PACKAGE_JSON);
      zip.file("index.js", INDEX_JS);
      zip.file("README.md", README_MD);
      zip.file("env.txt", envContent.trim());
      zip.file(".gitignore", "node_modules\n.env");

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${formData.botName.toUpperCase()}_CORE.zip`);
      setGenerated(true);
      updateLog('COMPILE SUCCESSFUL.');
    } catch (e) {
      updateLog('FATAL ERROR.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans relative overflow-hidden selection:bg-pink-500/30">
      
      {/* --- CHROMATIC BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT: EDITOR */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* HEADER */}
          <header className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-16 w-16 bg-black rounded-2xl border border-white/10 flex items-center justify-center">
                <Cpu className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                BotForge
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-0.5 w-6 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 shadow-cyan-500">System Online</p>
              </div>
            </div>
          </header>

          {/* IDENTITY SECTION (CYAN/BLUE THEME) */}
          <Section 
            title="Identity Matrix" 
            icon={<Fingerprint size={20}/>} 
            color="from-cyan-500 to-blue-500"
            glow="shadow-cyan-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input label="Designation" ph="e.g. OMEGA" val={formData.botName} set={(v: string) => setFormData({...formData, botName: v})} icon={<Ghost size={14}/>} />
              <Input label="Persona Type" ph="e.g. Cyberpunk Hacker" val={formData.personaRaw} set={(v: string) => setFormData({...formData, personaRaw: v})} icon={<Sparkles size={14}/>} />
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare size={12}/> Backstory Context
              </label>
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/50 to-blue-600/50 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
                <div className="bg-black/90 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
                  <textarea 
                    className="w-full bg-transparent p-5 text-sm outline-none h-32 text-gray-300 placeholder:text-gray-700 font-mono resize-none focus:text-white transition-colors"
                    placeholder="Describe the bot's hidden lore here..."
                    value={formData.backstoryRaw} 
                    onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SOCIAL SECTION (PURPLE/PINK THEME) */}
          <Section 
            title="Social Alignment" 
            icon={<Heart size={20}/>} 
            color="from-purple-500 to-pink-500"
            glow="shadow-purple-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input label="Likes" ph="Coding, Coffee" val={formData.likes} set={(v: string) => setFormData({...formData, likes: v})} icon={<Heart size={14} className="text-pink-500"/>} />
              <Input label="Dislikes" ph="Bugs, Water" val={formData.dislikes} set={(v: string) => setFormData({...formData, dislikes: v})} icon={<Skull size={14} className="text-purple-500"/>} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Hobbies" ph="Data Mining" val={formData.hobbies} set={(v: string) => setFormData({...formData, hobbies: v})} icon={<Activity size={14}/>} />
              <Input label="Allowed IDs" ph="User IDs" val={formData.likedUsers} set={(v: string) => setFormData({...formData, likedUsers: v})} icon={<Key size={14}/>} />
            </div>
          </Section>

          {/* NEURAL SECTION (EMERALD/GREEN THEME) */}
          <Section 
            title="Neural Config" 
            icon={<Code2 size={20}/>} 
            color="from-emerald-400 to-green-600"
            glow="shadow-emerald-500/20"
          >
            <div className="mb-6 bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Activity size={14}/> Response Frequency
                </span>
                <span className="font-mono text-xs text-white bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                  {formData.minRange} - {formData.maxRange} msgs
                </span>
              </div>
              <div className="flex gap-4">
                <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FeatureToggle label="Vision" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
              <FeatureToggle label="Images" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
              <FeatureToggle label="Voice" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
              <FeatureToggle label="Casual" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
            </div>
          </Section>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-2xl p-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-black h-full rounded-[14px] flex items-center justify-center py-6 group-hover:bg-black/80 transition-all">
              <div className="flex items-center gap-4">
                {loading ? <Cpu className="animate-spin text-white" /> : <Download className="text-white group-hover:scale-110 transition-transform" />}
                <span className="font-black text-xl italic uppercase tracking-widest text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500 transition-all">
                  {loading ? 'Compiling Neural Net...' : 'Initialize Core'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* RIGHT: CONSOLE & GUIDES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TERMINAL */}
          <div className="rounded-3xl bg-[#08080a] border border-white/10 overflow-hidden shadow-2xl relative">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <Terminal size={12}/> Console
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </div>
            <div className="p-6 h-[300px] overflow-y-auto font-mono text-xs space-y-2 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-cyan-500/80 border-l-2 border-cyan-500/20 pl-3">
                  <span className="opacity-50">{i.toString().padStart(2, '0')}</span> 
                  <span className="drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{log}</span>
                </div>
              ))}
              {loading && <div className="animate-pulse w-3 h-5 bg-cyan-500 ml-4" />}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* KEYS */}
                <div className="rounded-3xl bg-black/40 border border-white/10 p-6 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-all" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-5 flex items-center gap-2">
                    <Key size={16}/> API Credentials
                  </h3>
                  <div className="space-y-2">
                    <KeyLink label="Discord Token" desc="Dev Portal > Bot > Reset" />
                    <KeyLink label="Owner ID" desc="User Settings > Copy ID" />
                    <KeyLink label="Server ID" desc="Server Settings > Copy ID" />
                  </div>
                </div>

                {/* STEPS */}
                <div className="rounded-[2.5rem] bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                  <h3 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-2">
                    <Rocket size={16}/> Deployment Cycle
                  </h3>
                  <div className="space-y-8 relative z-10">
                    <Step num="1" title="Initialize" desc="Extract ZIP. Rename env.txt to .env" />
                    <Step num="2" title="Install" desc="Run 'npm install' in terminal" />
                    <Step num="3" title="Ignition" desc="Run 'node index.js' to launch" />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS (PREMIUM STYLED) ---

const Section = ({ title, icon, color, glow, children }: any) => (
  <section className={`relative rounded-3xl bg-[#0a0a0a] border border-white/5 p-6 md:p-8 overflow-hidden group hover:border-white/10 transition-colors ${glow}`}>
    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${color} opacity-[0.03] blur-[60px] group-hover:opacity-[0.06] transition-opacity`} />
    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        {icon}
      </div>
      <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300">{title}</h2>
    </div>
    <div className="relative z-10">{children}</div>
  </section>
);

const Input = ({ label, ph, val, set, icon }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] uppercase font-bold text-gray-500 tracking-widest ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl opacity-50 blur-[1px] group-focus-within:from-cyan-500 group-focus-within:to-blue-500 group-focus-within:opacity-100 transition-all duration-500" />
      <input 
        type="text" 
        className="relative w-full bg-[#050505] rounded-[10px] px-4 py-3.5 text-xs text-white placeholder:text-gray-700 outline-none font-medium tracking-wide transition-all" 
        placeholder={ph} 
        value={val} 
        onChange={e => set(e.target.value)} 
      />
    </div>
  </div>
);

const FeatureToggle = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={clsx("relative py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all duration-300 overflow-hidden group", 
      active ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]")}
  >
    <div className={clsx("h-1.5 w-8 rounded-full shadow-[0_0_10px_currentColor] transition-all", active ? "bg-emerald-400 shadow-emerald-500" : "bg-gray-800 shadow-none")} />
    <span className={clsx("text-[9px] font-black uppercase tracking-widest", active ? "text-emerald-400" : "text-gray-600")}>{label}</span>
  </button>
);

const KeyLink = ({ label, desc }: any) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 group cursor-pointer">
    <div>
      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0"/> {label}
      </div>
      <div className="text-[9px] uppercase font-mono text-gray-600 mt-0.5">{desc}</div>
    </div>
    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
      <Share2 size={12} />
    </div>
  </div>
);

const Step = ({ num, title, desc }: any) => (
  <div className="flex gap-5 group">
    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-lg font-black font-mono text-gray-700 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
      {num}
    </div>
    <div>
      <h5 className="text-white text-xs font-black uppercase tracking-widest italic">{title}</h5>
      <p className="text-gray-500 text-[10px] mt-1 group-hover:text-gray-300 transition-colors">{desc}</p>
    </div>
  </div>
);

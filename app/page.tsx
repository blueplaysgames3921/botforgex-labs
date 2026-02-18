'use client';

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Check, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, Layers, 
  Activity, ShieldCheck, HardDrive, Share2, Code2, Wifi
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotFactory() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['> System core initialized.']);
  const [formData, setFormData] = useState({
    botName: '', personaRaw: '', backstoryRaw: '', likes: '', dislikes: '',
    hobbies: '', likedUsers: '', minRange: 5, maxRange: 15,
    enableImage: true, enableVision: true, enableTTS: true, casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev.slice(-15), `> ${msg}`]);

  const callAI = async (prompt: string, type: 'prompt' | 'story' | 'temp') => {
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
    if (!formData.botName || !formData.personaRaw) return alert("Bot Name and Persona required!");
    setLoading(true); setGenerated(false);
    updateLog(`Initiating neural construction for ${formData.botName}...`);

    let finalSysPrompt = formData.personaRaw;
    let finalBackstory = formData.backstoryRaw;
    let temperature = "0.75";

    try {
      updateLog('Forging character logic... (No monologues)');
      const aiPrompt = await callAI(`Create a deep system prompt for: ${formData.personaRaw}`, 'prompt');
      if (aiPrompt.length > 10) finalSysPrompt = aiPrompt.replace(/\n/g, ' ');

      updateLog('Synthesizing cryptic history...');
      const aiStory = await callAI(`Backstory for: ${formData.backstoryRaw || formData.personaRaw}`, 'story');
      if (aiStory.length > 5) finalBackstory = aiStory;

      updateLog('Calibrating entropy levels...');
      const tempRes = await callAI(`Value 0.5-0.9 for: ${formData.personaRaw}`, 'temp');
      temperature = tempRes.match(/0\.\d+/)?.[0] || "0.75";
    } catch (err) { updateLog('Neural sync interrupted. Using raw vectors.'); }

    try {
      const envContent = `# CREDENTIALS\nBOT_TOKEN=\nPOLLINATIONS_KEY=\nOWNER_ID=\nSERVER_ID=\n\n# IDENTITY\nBOT_NAME="${formData.botName}"\nSYSTEM_PROMPT="${finalSysPrompt}"\nBACKSTORY="${finalBackstory}"\nHOBBIES="${formData.hobbies}"\nDISLIKES="${formData.dislikes}"\nLIKED_USERS="${formData.likedUsers}"\nCREATIVITY_LEVEL=${temperature}\nCASUAL_MODE=${formData.casualMode}\n\n# BEHAVIOR\nNATURAL_MIN=${formData.minRange}\nNATURAL_MAX=${formData.maxRange}\nENABLE_IMAGE_GEN=${formData.enableImage}\nENABLE_VISION=${formData.enableVision}\nENABLE_TTS=${formData.enableTTS}`;
      
      const zip = new JSZip();
      zip.file("package.json", PACKAGE_JSON);
      zip.file("index.js", INDEX_JS);
      zip.file("README.md", README_MD);
      zip.file("env.txt", envContent.trim());
      zip.file(".gitignore", "node_modules\n.env");

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${formData.botName.replace(/\s/g, '_')}_CORE.zip`);
      updateLog('Core fabrication complete. Package downloaded.');
      setGenerated(true);
    } catch (err) { updateLog('Critical Error: ZIP Compression failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 p-4 md:p-12 font-sans selection:bg-cyan-500/30">
      {/* Animated Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* LEFT: FORM */}
        <div className="lg:col-span-7 space-y-8">
          <header className="flex items-center gap-6 mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="h-16 w-16 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-2xl flex items-center justify-center relative">
                <Cpu className="text-cyan-400 animate-pulse" size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-600">
                BotForge<span className="text-cyan-500 text-2xl not-italic ml-1">OS</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Neural Engine Online</p>
              </div>
            </div>
          </header>

          <Section icon={<Sparkles size={20}/>} title="Identity Matrix" color="text-cyan-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input label="Bot Designation" val={formData.botName} set={(v) => setFormData({...formData, botName: v})} ph="e.g. Protocol-X" icon={<Activity size={14}/>} />
              <Input label="Neural Persona" val={formData.personaRaw} set={(v) => setFormData({...formData, personaRaw: v})} ph="e.g. Cynical AI Assistant" icon={<Share2 size={14}/>} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">
                <HardDrive size={12}/> Backstory Context
              </div>
              <textarea className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-cyan-500/50 transition-all outline-none h-28 resize-none" 
                placeholder="Where did this entity come from? Leave empty for AI to decide."
                value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
            </div>
          </Section>

          <Section icon={<Zap size={20}/>} title="Social Alignment" color="text-yellow-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input label="Preferred Inputs" val={formData.likes} set={(v) => setFormData({...formData, likes: v})} ph="Clean Code, Silence" />
              <Input label="Hostile Triggers" val={formData.dislikes} set={(v) => setFormData({...formData, dislikes: v})} ph="Spam, Water" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Sub-Routines (Hobbies)" val={formData.hobbies} set={(v) => setFormData({...formData, hobbies: v})} ph="Mining, Lore Analysis" />
              <Input label="Authorized Users (IDs)" val={formData.likedUsers} set={(v) => setFormData({...formData, likedUsers: v})} ph="Admin User IDs" />
            </div>
          </Section>

          <Section icon={<Server size={20}/>} title="Neural Configuration" color="text-emerald-500">
            <div className="mb-8 p-6 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex justify-between mb-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Natural Pulse (Frequency)</label>
                <span className="font-mono text-emerald-400 text-xs">{formData.minRange}-{formData.maxRange} msgs</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
                <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Toggle label="Image Gen" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
              <Toggle label="Vision" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
              <Toggle label="TTS Voice" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
              <Toggle label="Casual" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
            </div>
          </Section>

          <button onClick={handleGenerate} disabled={loading} className="group relative w-full overflow-hidden py-6 rounded-2xl bg-white text-black font-black text-xl transition-all active:scale-[0.98] disabled:opacity-50">
            <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-4 group-hover:text-black transition-colors">
              {loading ? <Cpu className="animate-spin" /> : <Download size={24}/>}
              {loading ? 'SYNCING NEURAL PATHWAYS...' : 'COMPILE BOT CORE'}
            </div>
          </button>
        </div>

        {/* RIGHT: TERMINAL & GUIDES */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[300px]">
            <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"><Terminal size={12}/> Console_Out</div>
              <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-800" /><div className="w-2 h-2 rounded-full bg-zinc-800" /><div className="w-2 h-2 rounded-full bg-zinc-800" /></div>
            </div>
            <div className="p-6 overflow-y-auto font-mono text-[11px] space-y-2 text-cyan-400/80 scrollbar-hide">
              {logs.map((log, i) => <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i}>{log}</motion.div>)}
              {loading && <div className="animate-pulse inline-block w-2 h-4 bg-cyan-400 ml-1" />}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-cyan-900/20 to-black border border-cyan-500/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Key size={60}/></div>
                  <h3 className="text-cyan-400 font-bold mb-5 flex items-center gap-2 uppercase tracking-tighter italic text-lg"><ShieldCheck size={20}/> Core Credentials</h3>
                  <div className="space-y-4">
                    <KeyLink label="Discord Bot Token" url="https://discord.com/developers/applications" desc="Reset token in Bot settings" />
                    <KeyLink label="User Owner ID" url="#" desc="Right Click Profile -> Copy ID" />
                    <KeyLink label="Target Server ID" url="#" desc="Right Click Server -> Copy ID" />
                    <KeyLink label="Pollinations Key" url="https://pollinations.ai" desc="Neural processing API key" />
                  </div>
                </div>

                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-4">
                  <ShieldAlert className="text-red-500 shrink-0" size={24} />
                  <div className="text-[11px] leading-relaxed">
                    <span className="text-red-500 font-bold uppercase block mb-1">Fatal Step Avoidance</span>
                    <p className="text-zinc-400">Locate <code className="text-white bg-white/10 px-1 rounded">env.txt</code> in the ZIP. You MUST rename it to <code className="text-white bg-white/10 px-1 rounded">.env</code> or the engine will fail to ignite.</p>
                  </div>
                </div>

                <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-8 relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12"><Rocket size={200}/></div>
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Globe className="text-emerald-400" size={22} />
                    <h3 className="text-white font-bold uppercase italic tracking-widest text-sm">Deployment Operations</h3>
                  </div>
                  
                  <div className="space-y-8">
                    <DeploymentStep num="01" title="Local Verification" text="Install Node.js. Run 'npm i' then 'node index.js' to test stability." icon={<Code2 size={16}/>} />
                    <DeploymentStep num="02" title="Railway Deployment" text="Push folder to GitHub. Link Railway.app project. Add variables to 'Environment' tab." icon={<Layers size={16}/>} />
                    <DeploymentStep num="03" title="Permanent Uptime" text="On VPS/Linux, use PM2: 'pm2 start index.js --name bot'. Auto-restarts on crash." icon={<Wifi size={16}/>} />
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

// COMPONENTS
const Section = ({ icon, title, color, children }: any) => (
  <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">{icon}</div>
    <div className={`flex items-center gap-3 mb-10 ${color}`}>
      <div className="p-2 bg-current/10 rounded-lg">{icon}</div>
      <h2 className="text-xs font-black uppercase tracking-[0.4em]">{title}</h2>
    </div>
    {children}
  </section>
);

const Input = ({ label, val, set, ph, icon }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2 ml-1">{icon} {label}</label>
    <input type="text" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/40 focus:bg-white/[0.07] outline-none transition-all" 
      placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const Toggle = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={clsx("w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 border font-bold text-[10px] uppercase tracking-widest transition-all", 
    active ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "bg-black/40 text-zinc-600 border-white/5 hover:border-white/10")}>
    <div className={clsx("h-1.5 w-6 rounded-full", active ? "bg-cyan-500" : "bg-zinc-800")} />
    {label}
  </button>
);

const KeyLink = ({ label, url, desc }: any) => (
  <div className="flex justify-between items-center group py-2 border-b border-white/5 last:border-0">
    <div>
      <div className="text-white text-xs font-bold group-hover:text-cyan-400 transition-colors">{label}</div>
      <div className="text-[9px] uppercase font-mono text-zinc-500 tracking-tighter">{desc}</div>
    </div>
    <a href={url} target="_blank" className="p-2 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-lg transition-all"><Box size={14} /></a>
  </div>
);

const DeploymentStep = ({ num, title, text, icon }: any) => (
  <div className="flex gap-6 group">
    <div className="text-2xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors font-mono">{num}</div>
    <div className="space-y-1">
      <h5 className="text-white text-[13px] font-bold flex items-center gap-2">{icon} {title}</h5>
      <p className="text-zinc-500 text-[11px] leading-relaxed group-hover:text-zinc-300 transition-colors">{text}</p>
    </div>
  </div>
);

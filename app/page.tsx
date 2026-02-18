'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Check, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket 
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface InputGroupProps {
  label: string;
  val: string;
  set: (value: string) => void;
  ph: string;
}

export default function BotFactory() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['> Engine Initialized.']);

  const [formData, setFormData] = useState({
    botName: '',
    personaRaw: '',
    backstoryRaw: '',
    likes: '',
    dislikes: '',
    hobbies: '',
    likedUsers: '',
    minRange: 5,
    maxRange: 15,
    enableImage: true,
    enableVision: true,
    enableTTS: true,
    casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const callAI = async (prompt: string) => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server Error");
      return data.content;
    } catch (e) {
      console.error(e);
      return prompt; 
    }
  };

  const handleGenerate = async () => {
    if (!formData.botName || !formData.personaRaw) {
      alert("Bot Name and Persona are required!");
      return;
    }

    setLoading(true);
    setGenerated(false);
    updateLog(`Establishing Neural Uplink...`);

    let finalSysPrompt = formData.personaRaw;
    let finalBackstory = formData.backstoryRaw;
    let temperature = "0.7";

    try {
      updateLog('Encoding High-Density Logic...');
      const aiPrompt = await callAI(`Create a robust system prompt for a Discord bot. No markdown. Persona: ${formData.personaRaw}`);
      if (aiPrompt && aiPrompt.length > 20) {
         finalSysPrompt = aiPrompt.substring(0, 900).replace(/\n/g, ' ');
      }

      updateLog('Synthesizing History...');
      const aiStory = await callAI(`Write a 2-sentence mysterious backstory for: ${formData.backstoryRaw || formData.personaRaw}`);
      if (aiStory && aiStory.length > 5) {
          finalBackstory = aiStory.replace(/\n/g, ' ');
      }

      updateLog('Optimizing Creativity Matrix...');
      const tempRes = await callAI(`Analyze: "${formData.personaRaw}". Return ONLY a number between 0.5 and 0.9.`);
      const extractedTemp = tempRes.match(/0\.\d+/)?.[0];
      if (extractedTemp) temperature = extractedTemp;

    } catch (err) {
      updateLog('Latency Detected: Proceeding with raw data.');
    }

    try {
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
CREATIVITY_LEVEL=${temperature}
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
      saveAs(blob, `${formData.botName.replace(/\s/g, '_')}_CORE.zip`);

      updateLog('Fabrication Complete. Downloading Core.');
      setGenerated(true);
    } catch (err) {
      updateLog('Critical: Compile failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
      
      {/* LEFT COLUMN: EDITOR */}
      <div className="lg:col-span-7 space-y-10">
        <header className="flex items-center gap-5">
          <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <Cpu className="text-white" size={30} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">BotForge<span className="text-cyan-400">.v2</span></h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.2em]">Neural Discord Architect</p>
          </div>
        </header>

        {/* INPUT SECTIONS */}
        <div className="space-y-6">
          <Section icon={<Sparkles size={18}/>} title="Identity Matrix" color="text-blue-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <InputGroup label="Designation" val={formData.botName} set={(v) => setFormData({...formData, botName: v})} ph="e.g. Ghost-6" />
              <InputGroup label="Base Persona" val={formData.personaRaw} set={(v) => setFormData({...formData, personaRaw: v})} ph="e.g. Grumpy Mechanic" />
            </div>
            <label className="label-premium">Backstory Context</label>
            <textarea className="input-premium h-24 resize-none" placeholder="Deep lore, secrets, or origins..."
               value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
          </Section>

          <Section icon={<Zap size={18}/>} title="Social Alignment" color="text-yellow-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Likes" val={formData.likes} set={(v) => setFormData({...formData, likes: v})} ph="Coffee, Code" />
              <InputGroup label="Dislikes" val={formData.dislikes} set={(v) => setFormData({...formData, dislikes: v})} ph="Lag, Water" />
            </div>
          </Section>

          <Section icon={<Server size={18}/>} title="Neural Config" color="text-emerald-400">
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <label className="label-premium">Natural Interaction Frequency</label>
                <span className="text-xs font-mono text-emerald-400">Range: {formData.minRange}-{formData.maxRange} msgs</span>
              </div>
              <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
                <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Toggle label="Image Synthesis" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
                <Toggle label="Vision Processing" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
                <Toggle label="Voice Output" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
                <Toggle label="Lowercase Mode" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
            </div>
          </Section>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-6 rounded-2xl bg-white text-black font-black text-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-4 group"
        >
          {loading ? <Cpu className="animate-spin" /> : <Download className="group-hover:translate-y-1 transition-transform" />}
          {loading ? 'GENERATING...' : 'COMPILE BOT CORE'}
        </button>
      </div>

      {/* RIGHT COLUMN: STATUS & GUIDES */}
      <div className="lg:col-span-5 space-y-8">
        {/* TERMINAL LOG */}
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
               <Terminal size={14} className="text-gray-400" />
               <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">System_Output</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="p-6 h-56 overflow-y-auto font-mono text-xs space-y-2 text-cyan-500/90 scrollbar-hide">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
            {loading && <div className="animate-pulse">_</div>}
          </div>
        </div>

        <AnimatePresence>
          {generated && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              
              {/* CREDENTIALS SECTION */}
              <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 p-6 rounded-2xl">
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter italic">
                  <Key size={18} /> Required Credentials
                </h3>
                <div className="space-y-3">
                  <KeyLink label="Bot Token" url="https://discord.com/developers/applications" desc="Bot -> Reset Token" />
                  <KeyLink label="Owner ID" url="#" desc="Right Click your Profile -> Copy ID" />
                  <KeyLink label="Pollinations Key" url="https://pollinations.ai" desc="Get API Key for the bot brain" />
                </div>
              </div>
              
              {/* WARNING BOX */}
              <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <ShieldAlert className="text-red-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-red-500 font-bold text-sm uppercase italic">Crucial Instruction</h4>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    Inside the ZIP, you will find <span className="text-white font-mono font-bold">env.txt</span>. 
                    You <span className="underline decoration-red-500 text-white">must</span> rename this file to 
                    <span className="text-white font-mono font-bold"> .env</span> before you start the bot.
                  </p>
                </div>
              </div>

              {/* HOSTING & SETUP GUIDE */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-6 shadow-2xl">
                <h3 className="text-emerald-400 font-bold text-sm flex items-center gap-2 uppercase italic tracking-widest">
                  <Globe size={18} /> Deployment Guide
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-xs font-bold">1</div>
                    <div>
                      <h5 className="text-white text-sm font-bold">Install Node.js</h5>
                      <p className="text-gray-500 text-[11px] mt-1">Extract the ZIP, open a terminal in that folder, and run: <code className="text-cyan-400">npm install</code></p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-xs font-bold">2</div>
                    <div>
                      <h5 className="text-white text-sm font-bold">Hosting (Railway / VPS)</h5>
                      <p className="text-gray-500 text-[11px] mt-1">We recommend **Railway.app**. Just upload this folder to GitHub, link it, and add your .env variables in their dashboard.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-xs font-bold">3</div>
                    <div>
                      <h5 className="text-white text-sm font-bold">Launch</h5>
                      <p className="text-gray-500 text-[11px] mt-1">Run <code className="text-emerald-400">node index.js</code> or use **PM2** to keep it running 24/7 on a server.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-center">
                   <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono italic">
                      <Rocket size={12} /> Ready for Ignition
                   </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Visual Sub-components
const Section = ({ icon, title, color, children }: any) => (
  <section className="bg-white/[0.02] border border-white/5 p-7 rounded-3xl backdrop-blur-md relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">{icon}</div>
    <div className={`flex items-center gap-3 mb-8 ${color}`}>
      {icon}
      <h2 className="text-sm font-black uppercase tracking-[0.3em]">{title}</h2>
    </div>
    {children}
  </section>
);

const InputGroup = ({ label, val, set, ph }: InputGroupProps) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider ml-1">{label}</label>
    <input type="text" className="input-premium" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const Toggle = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={clsx("w-full px-4 py-4 rounded-xl flex items-center justify-between transition-all border font-bold text-[11px] uppercase tracking-tighter", 
    active ? "bg-white text-black border-white" : "bg-transparent text-gray-500 border-white/10 hover:border-white/20")}>
    <span>{label}</span>
    {active ? <Check size={14} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border-2 border-gray-700" />}
  </button>
);

const KeyLink = ({ label, url, desc }: any) => (
  <div className="flex justify-between items-center group/item py-1">
    <div>
      <div className="text-white text-xs font-bold group-hover/item:text-blue-400 transition-colors">{label}</div>
      <div className="text-gray-500 text-[9px] uppercase tracking-tighter">{desc}</div>
    </div>
    <a href={url} target="_blank" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
      <Box size={14} className="text-blue-400" />
    </a>
  </div>
);

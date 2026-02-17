'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Cpu, Sparkles, Check, Zap, ShieldAlert, Terminal, Server, Key, User } from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Use your Vercel Environment Variable
const INTERNAL_AI_KEY = process.env.NEXT_PUBLIC_POLLINATIONS_KEY;

interface InputGroupProps {
  label: string;
  val: string;
  set: (value: string) => void;
  ph: string;
}

export default function BotFactory() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['> System ready.']);

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
    const model = 'nova-fast'; // Hardcoded as requested
    
    // Attempt Authenticated Call using your Vercel Key
    try {
      const res = await fetch(`https://gen.pollinations.ai/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INTERNAL_AI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          seed: Math.floor(Math.random() * 1000)
        })
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.error("Auth AI call failed, falling back to public...");
    }

    // Secondary Fallback to Public Endpoint
    const publicRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${model}`);
    if (publicRes.ok) return await publicRes.text();
    
    throw new Error("AI Generation Limited");
  };

  const handleGenerate = async () => {
    if (!formData.botName || !formData.personaRaw) {
      alert("Bot Name and Persona are required!");
      return;
    }

    setLoading(true);
    setGenerated(false);
    updateLog(`Connecting to Nova-Fast via Internal Uplink...`);

    let finalSysPrompt = formData.personaRaw;
    let finalBackstory = formData.backstoryRaw;
    let temperature = "0.7";

    try {
      updateLog('Generating high-density system prompt...');
      const aiPrompt = await callAI(`Create a robust system prompt for a Discord bot. No markdown. Persona: ${formData.personaRaw}`);
      finalSysPrompt = aiPrompt.substring(0, 800).replace(/\n/g, ' ');

      updateLog('Fabricating backstory...');
      const aiStory = await callAI(`Write a 2-sentence mysterious backstory for: ${formData.backstoryRaw || formData.personaRaw}`);
      finalBackstory = aiStory.replace(/\n/g, ' ');

      updateLog('Analyzing creativity index...');
      const tempRes = await callAI(`Analyze this: "${formData.personaRaw}". Return ONLY a number between 0.5 and 0.9.`);
      temperature = tempRes.match(/0\.\d+/)?.[0] || "0.7";
    } catch (err) {
      updateLog('Uplink Busy: Using raw input data.');
    }

    try {
      const envContent = `
# ═══ USER PROVIDED CREDENTIALS ═══
BOT_TOKEN=
POLLINATIONS_KEY=
OWNER_ID=
SERVER_ID=

# ═══ AI GENERATED IDENTITY ═══
BOT_NAME="${formData.botName}"
SYSTEM_PROMPT="${finalSysPrompt}"
BACKSTORY="${finalBackstory}"
HOBBIES="${formData.hobbies}"
DISLIKES="${formData.dislikes}"
LIKED_USERS="${formData.likedUsers}"
CREATIVITY_LEVEL=${temperature}
CASUAL_MODE=${formData.casualMode}

# ═══ BEHAVIOR & RANGE ═══
NATURAL_MIN=${formData.minRange}
NATURAL_MAX=${formData.maxRange}
ENABLE_IMAGE_GEN=${formData.enableImage}
ENABLE_VISION=${formData.enableVision}
ENABLE_TTS=${formData.enableTTS}

# ═══ DO NOT TOUCH ═══
UNIVERSAL_ENDPOINT=gen.pollinations.ai
`;

      const zip = new JSZip();
      zip.file("package.json", PACKAGE_JSON);
      zip.file("index.js", INDEX_JS);
      zip.file("README.md", README_MD);
      zip.file("env.txt", envContent.trim());
      zip.file(".gitignore", "node_modules\n.env");

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${formData.botName.replace(/\s/g, '_')}_CORE.zip`);

      updateLog('Build Complete. Core Downloaded.');
      setGenerated(true);
    } catch (err) {
      updateLog('Critical Error: Compression failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN */}
      <div className="lg:col-span-7 space-y-8">
        <header className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">BotForge</h1>
            <p className="text-gray-500 text-sm font-mono">Powered by Nova-Fast</p>
          </div>
        </header>

        <section className="bg-glass border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 text-accent">
            <Sparkles size={18} />
            <h2 className="text-lg font-bold tracking-wide">IDENTITY MATRIX</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-premium">Designation (Name)</label>
              <input type="text" className="input-premium" placeholder="e.g. Nexus-9" 
                value={formData.botName} onChange={e => setFormData({...formData, botName: e.target.value})} />
            </div>
            <div>
              <label className="label-premium">Core Persona</label>
              <input type="text" className="input-premium" placeholder="e.g. Sassy, tired sysadmin" 
                 value={formData.personaRaw} onChange={e => setFormData({...formData, personaRaw: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label-premium">Backstory Context</label>
            <textarea className="input-premium h-24 resize-none" placeholder="Origin story, hidden motives..."
               value={formData.backstoryRaw} onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} />
          </div>
        </section>

        <section className="bg-glass border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
           <div className="flex items-center gap-2 mb-6 text-blue-400">
            <Zap size={18} />
            <h2 className="text-lg font-bold tracking-wide">PERSONALITY VECTORS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Likes" val={formData.likes} set={(v) => setFormData({...formData, likes: v})} ph="e.g. RAM, Cats" />
            <InputGroup label="Dislikes" val={formData.dislikes} set={(v) => setFormData({...formData, dislikes: v})} ph="e.g. Water, Reboots" />
            <InputGroup label="Hobbies" val={formData.hobbies} set={(v) => setFormData({...formData, hobbies: v})} ph="e.g. Mining crypto" />
            <InputGroup label="Fav Users (IDs)" val={formData.likedUsers} set={(v) => setFormData({...formData, likedUsers: v})} ph="123456789, 987654321" />
          </div>
        </section>

        <section className="bg-glass border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 text-emerald-400">
            <Server size={18} />
            <h2 className="text-lg font-bold tracking-wide">NEURAL CONFIGURATION</h2>
          </div>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="label-premium text-gray-300">Natural Messaging Frequency</label>
              <span className="text-xs font-mono text-emerald-400">Every {formData.minRange} - {formData.maxRange} msgs</span>
            </div>
            <div className="flex gap-4 items-center bg-black/20 p-4 rounded-lg">
              <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
              <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
            </div>
          </div>
          <div className="space-y-3">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Toggle label="Image Generation" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
                <Toggle label="Vision (Gemini)" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
                <Toggle label="Voice (TTS)" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
                <Toggle label="Casual (Lowercase)" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
             </div>
          </div>
        </section>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-5 rounded-xl bg-gradient-to-r from-accent to-purple-600 hover:to-purple-500 text-white font-bold text-lg shadow-xl shadow-purple-900/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? <Cpu className="animate-spin" /> : <Download />}
          {loading ? 'UPLINKING TO NOVA-FAST...' : 'GENERATE BOT CORE (.ZIP)'}
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#0c0c0e] border border-white/10 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
          <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
            <Terminal size={14} className="text-gray-500" />
            <span className="text-gray-500">factory_log.sh</span>
          </div>
          <div className="p-4 h-48 overflow-y-auto space-y-1 text-green-500/80">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
            {loading && <div className="animate-pulse">_</div>}
          </div>
        </div>

        <AnimatePresence>
          {generated && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden group">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Check size={18} /> Step 1: The Keys</h3>
                <div className="space-y-2 text-sm">
                  <KeyLink label="Bot Token" url="https://discord.com/developers/applications" desc="Portal -> Bot -> Reset Token" />
                  <KeyLink label="Owner ID" url="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" desc="User Settings -> Advanced -> Developer Mode -> Right Click Profile -> Copy ID" />
                  <KeyLink label="Server ID" url="#" desc="Right click server icon -> Copy ID" />
                  <KeyLink label="Pollinations Key" url="https://pollinations.ai" desc="Get your own key for the bot's runtime" />
                </div>
              </div>
              
              <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl flex items-start gap-4">
                <ShieldAlert className="text-red-400 shrink-0" />
                <div>
                  <h4 className="text-red-400 font-bold text-sm">CRITICAL: Rename the file</h4>
                  <p className="text-gray-400 text-xs mt-1">Rename <b>env.txt</b> to <b className="text-white">.env</b> before hosting.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const InputGroup = ({ label, val, set, ph }: InputGroupProps) => (
  <div>
    <label className="label-premium">{label}</label>
    <input type="text" className="input-premium" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  </div>
);

const Toggle = ({ label, active, onClick }: any) => (
  <div onClick={onClick} className={clsx("cursor-pointer border p-3 rounded-lg flex items-center gap-3 transition-all", 
    active ? "bg-accent/10 border-accent/50" : "bg-black/20 border-white/5 hover:border-white/10")}>
    <div className={clsx("w-4 h-4 rounded-sm flex items-center justify-center transition-colors", active ? "bg-accent" : "bg-gray-700")}>
      {active && <Check size={12} className="text-white" />}
    </div>
    <span className={clsx("text-xs font-semibold", active ? "text-white" : "text-gray-500")}>{label}</span>
  </div>
);

const KeyLink = ({ label, url, desc }: any) => (
  <div className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0">
    <div>
      <div className="text-white font-medium">{label}</div>
      <div className="text-gray-500 text-[10px]">{desc}</div>
    </div>
    <a href={url} target="_blank" className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-emerald-400 transition-colors shrink-0">Link ↗</a>
  </div>
);

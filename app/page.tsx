'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, Cpu, Sparkles, Zap, ShieldAlert, 
  Terminal, Server, Key, Globe, Box, Rocket, 
  Activity, ShieldCheck, ExternalLink, Code2, 
  Settings, Target, Fingerprint, Radar, Gauge, ChevronRight,
  MessageSquare, Heart, Skull, ZapOff, Ghost, Boxes, Link as LinkIcon,
  Layers, HardDrive, Share2, Eye, X, Send
} from 'lucide-react';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function BotForgeUltimate() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM_READY', '> AWAITING_INPUT']);
  
  // Preview States
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [previewMessages, setPreviewMessages] = useState([
    { role: 'bot', content: 'Hi there! I am ready to test my new personality. Send me a message!' }
  ]);

  const [formData, setFormData] = useState({
    botName: '', personaRaw: '', backstoryRaw: '', likes: '', dislikes: '',
    hobbies: '', likedUsers: '', minRange: 5, maxRange: 15,
    enableImage: true, enableVision: true, enableTTS: true, casualMode: true,
  });

  const updateLog = (msg: string) => setLogs(prev => [...prev.slice(-10), `> ${msg}`]);

  const handlePreviewChat = async () => {
    const userMessagesCount = previewMessages.filter(m => m.role === 'user').length;
    if (userMessagesCount >= 2 || !chatInput.trim() || previewLoading) return;

    const userMsg = { role: 'user', content: chatInput };
    setPreviewMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setPreviewLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: chatInput, 
          type: 'preview_chat', 
          persona: formData.personaRaw || "A helpful assistant"
        })
      });
      const data = await res.json();
      setPreviewMessages(prev => [...prev, { role: 'bot', content: data.content || "Connection lost..." }]);
    } catch (e) {
      setPreviewMessages(prev => [...prev, { role: 'bot', content: "SYSTEM_ERROR: Neural link failed." }]);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.botName || !formData.personaRaw) return alert("MISSING CORE DATA");
    setLoading(true); setGenerated(false);
    updateLog(`INITIALIZING: ${formData.botName.toUpperCase()}...`);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: formData.personaRaw, type: 'prompt' })
      });
      const data = await res.json();
      const finalSysPrompt = data.content || "Standard AI Assistant";
      updateLog('NEURAL NETWORKS ALIGNED.');

      const storyRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: formData.backstoryRaw || formData.personaRaw, type: 'story' })
      });
      const storyData = await storyRes.json();
      const finalBackstory = storyData.content || "Data corrupted.";
      updateLog('HISTORY FRAGMENTS ASSEMBLED.');

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
      updateLog('COMPILE COMPLETE. DOWNLOADING...');
    } catch (e) {
      updateLog('CRITICAL FAILURE.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <header className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500" />
                <div className="relative h-16 w-16 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center">
                  <Boxes className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" size={32} />
                </div>
              </div>
              <div>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                  BotForge<span className="text-cyan-500 text-4xl align-top ml-1">X</span>
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 mt-1">Discord Chatbot Factory</p>
              </div>
            </div>
          </header>

          <GlassPanel title="Identity Matrix" icon={<Fingerprint className="text-cyan-400" size={18}/>} color="border-cyan-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <PremiumInput label="Designation" ph="e.g. OMEGA-1" val={formData.botName} set={(v: string) => setFormData({...formData, botName: v})} />
              <PremiumInput label="Neural Persona" ph="e.g. Sarcastic Assistant" val={formData.personaRaw} set={(v: string) => setFormData({...formData, personaRaw: v})} />
            </div>
            <div className="space-y-2">
              <Label text="Backstory Override (Premium Terminal)" icon={<MessageSquare size={12}/>} />
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-50 group-hover:opacity-100 transition-all" />
                <textarea 
                  className="relative w-full bg-[#050505] p-5 text-sm outline-none h-32 text-gray-300 placeholder:text-gray-700 font-mono resize-none rounded-[15px] focus:text-white transition-colors"
                  placeholder="Inject specific lore here..."
                  value={formData.backstoryRaw} 
                  onChange={e => setFormData({...formData, backstoryRaw: e.target.value})} 
                />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel title="Behavioral Logic" icon={<Target className="text-purple-400" size={18}/>} color="border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <PremiumInput label="Likes" ph="Data, Efficiency" val={formData.likes} set={(v: string) => setFormData({...formData, likes: v})} />
              <PremiumInput label="Dislikes" ph="Spam, Latency" val={formData.dislikes} set={(v: string) => setFormData({...formData, dislikes: v})} />
              <PremiumInput label="Subroutines" ph="Moderation" val={formData.hobbies} set={(v: string) => setFormData({...formData, hobbies: v})} />
              <PremiumInput label="Favorite Users (IDs)" ph="User IDs" val={formData.likedUsers} set={(v: string) => setFormData({...formData, likedUsers: v})} />
            </div>
          </GlassPanel>

          <GlassPanel title="Hardware Config" icon={<Cpu className="text-emerald-400" size={18}/>} color="border-emerald-500/30">
            <div className="mb-6 bg-white/[0.03] border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Activity size={14}/> Neural Message Frequency
                </span>
                <span className="font-mono text-[10px] text-white bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                  {formData.minRange} - {formData.maxRange} msgs
                </span>
              </div>
              <div className="flex gap-6">
                <div className="w-full space-y-2">
                  <span className="text-[8px] uppercase text-zinc-500 font-black">Min Threshold</span>
                  <input type="range" min="1" max="20" value={formData.minRange} onChange={e => setFormData({...formData, minRange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="w-full space-y-2">
                  <span className="text-[8px] uppercase text-zinc-500 font-black">Max Threshold</span>
                  <input type="range" min="21" max="100" value={formData.maxRange} onChange={e => setFormData({...formData, maxRange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ToggleBtn label="Vision" active={formData.enableVision} onClick={() => setFormData({...formData, enableVision: !formData.enableVision})} />
              <ToggleBtn label="Imaging" active={formData.enableImage} onClick={() => setFormData({...formData, enableImage: !formData.enableImage})} />
              <ToggleBtn label="Voice" active={formData.enableTTS} onClick={() => setFormData({...formData, enableTTS: !formData.enableTTS})} />
              <ToggleBtn label="Casual" active={formData.casualMode} onClick={() => setFormData({...formData, casualMode: !formData.casualMode})} />
            </div>
          </GlassPanel>

          <button onClick={handleGenerate} disabled={loading} className="w-full relative group overflow-hidden rounded-2xl p-[1px] transition-all active:scale-[0.99]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-white to-purple-500 animate-shimmer" />
            <div className="relative bg-black h-full rounded-[15px] flex items-center justify-center py-6 group-hover:bg-transparent transition-all">
              <div className="flex items-center gap-3">
                {loading ? <Cpu className="animate-spin text-white" /> : <Zap className="text-white group-hover:text-black transition-colors" />}
                <span className="font-black text-xl italic uppercase tracking-[0.2em] text-white group-hover:text-black">INITIALIZE BUILD</span>
              </div>
            </div>
          </button>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#080808] border border-white/10 overflow-hidden shadow-2xl">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                <Terminal size={12} className="text-cyan-500"/> System_Log
              </div>
            </div>
            <div className="p-6 h-[200px] overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-cyan-500/20 pl-3">
                  <span className="text-zinc-600">{i.toString().padStart(2, '0')}</span> 
                  <span className="text-cyan-400/80">{log}</span>
                </div>
              ))}
              {loading && <div className="animate-pulse w-2 h-4 bg-cyan-500 ml-4" />}
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="p-6 rounded-3xl bg-black border border-white/10 space-y-6">
                  <h3 className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs flex items-center gap-2"><Share2 size={16}/> Build Actions</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setShowPreview(true)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black py-4 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      <Eye size={16} /> Preview App
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">CONNECTING...</span>
                </div>
                <button onClick={() => setShowPreview(false)} className="text-zinc-500 hover:text-white"><X size={18}/></button>
              </div>

              <div className="h-[400px] overflow-y-auto p-6 space-y-4 flex flex-col scrollbar-hide">
                {previewMessages.map((m, i) => (
                  <div key={i} className={clsx(
                    "max-w-[85%] p-4 rounded-2xl text-xs font-mono leading-relaxed",
                    m.role === 'user' ? "self-end bg-cyan-500/10 border border-cyan-500/20 text-cyan-100" : "self-start bg-white/5 border border-white/10 text-zinc-300"
                  )}>
                    {m.content}
                  </div>
                ))}
                {previewLoading && (
                  <div className="self-start bg-white/5 p-4 rounded-2xl flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                {previewMessages.filter(m => m.role === 'user').length >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl mt-4">
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Neural Link Terminated (2/2)</p>
                     <p className="text-[11px] text-zinc-400 italic">"The bot wants to tell you more... download bot zip and host it for unlimited chatting!"</p>
                  </motion.div>
                )}
              </div>

              <div className="p-4 bg-black/50 border-t border-white/5 backdrop-blur-xl">
                <div className="relative">
                  <input 
                    disabled={previewMessages.filter(m => m.role === 'user').length >= 2 || previewLoading}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePreviewChat()}
                    placeholder={previewMessages.filter(m => m.role === 'user').length >= 2 ? "Limit reached." : "Send command..."}
                    className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 px-5 text-xs outline-none focus:border-cyan-500/50 transition-all disabled:opacity-30 font-mono"
                  />
                  <button 
                    onClick={handlePreviewChat}
                    disabled={previewMessages.filter(m => m.role === 'user').length >= 2 || previewLoading}
                    className="absolute right-3 top-2.5 p-2 bg-cyan-600 text-black rounded-xl hover:bg-cyan-400 transition-all active:scale-90 disabled:opacity-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const GlassPanel = ({ children, title, icon, color }: any) => (
  <div className={clsx("p-6 rounded-[2rem] bg-black/40 border backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all", color)}>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/90">{title}</h2>
    </div>
    {children}
  </div>
);

const PremiumInput = ({ label, ph, val, set }: { label: string, ph: string, val: string, set: (v: string) => void }) => (
  <div className="space-y-2 group">
    <Label text={label} />
    <input 
      type="text" value={val} onChange={e => set(e.target.value)} placeholder={ph}
      className="w-full bg-[#050505] border border-white/5 rounded-xl p-4 text-xs font-mono outline-none focus:border-cyan-500/40 transition-all text-gray-300 placeholder:text-gray-800"
    />
  </div>
);

const ToggleBtn = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={clsx("relative py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all duration-300", 
    active ? "bg-white/10 border-emerald-500/40" : "bg-black border-white/5 hover:border-white/10")}>
    <div className={clsx("h-1.5 w-6 rounded-full transition-all", active ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-zinc-800")} />
    <span className={clsx("text-[9px] font-black uppercase tracking-widest", active ? "text-emerald-400" : "text-zinc-600")}>{label}</span>
  </button>
);

const Label = ({ text, icon }: { text: string, icon?: React.ReactNode }) => (
  <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest ml-1 flex items-center gap-2">
    {icon} {text}
  </label>
);

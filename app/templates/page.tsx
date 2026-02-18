'use client';
import { LayoutGrid, Download, Sparkles, Ghost, Skull, Heart, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';

const TEMPLATES = [
  { name: "Void Stalker", icon: <Ghost />, desc: "An eerie, cryptic entity that speaks in riddles.", persona: "A haunting presence from the void.", color: "text-purple-500" },
  { name: "Cyber-Merc", icon: <Zap />, desc: "High-octane, aggressive, and tech-focused.", persona: "A battle-hardened mercenary from 2077.", color: "text-cyan-500" },
  { name: "Blood Feast", icon: <Skull />, desc: "Intense, predatory horror persona.", persona: "A ravenous predator with a taste for fear.", color: "text-red-500" },
  { name: "Neon Idol", icon: <Heart />, desc: "Bubbly, high-energy J-Pop aesthetic bot.", persona: "A world-famous virtual idol with infinite energy.", color: "text-pink-500" },
  // ... Add 16 more variants here following this object structure
];

export default function TemplatesPage() {
  const downloadTemplate = async (t: typeof TEMPLATES[0]) => {
    const zip = new JSZip();
    const env = `# IDENTITY\nBOT_NAME="${t.name.toUpperCase()}"\nSYSTEM_PROMPT="You are ${t.persona}"\nBACKSTORY="A specialized fragment of the BotForgeX matrix."\nHOBBIES="Analyzing Data"\nCREATIVITY_LEVEL=0.8`;
    
    zip.file("index.js", INDEX_JS);
    zip.file("package.json", PACKAGE_JSON);
    zip.file("README.md", README_MD);
    zip.file("env.txt", env);
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${t.name.replace(/\s+/g, '_')}_TEMPLATE.zip`);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Persona <span className="text-purple-500">Templates</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#080808] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between group">
              <div>
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${t.color}`}>{t.icon}</div>
                <h3 className="font-black uppercase italic tracking-wider mb-2">{t.name}</h3>
                <p className="text-[10px] font-mono text-zinc-500 mb-6">{t.desc}</p>
              </div>
              <button 
                onClick={() => downloadTemplate(t)}
                className="w-full py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Download size={14}/> Download Core
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

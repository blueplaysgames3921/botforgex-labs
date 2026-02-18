'use client';
import { LayoutGrid, Download, Sparkles, Ghost, Skull, Heart, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';

const TEMPLATES = [
  
  { name: "Void Stalker", icon: <Ghost />, desc: "Cryptic riddles and eerie presence.", persona: "A haunting void entity.", color: "text-purple-500" },
  { name: "Neon Idol", icon: <Heart />, desc: "Bubbly, high-energy J-Pop aesthetic bot.", persona: "A world-famous virtual idol with infinite energy.", color: "text-pink-500" },
  { name: "Rogue Engine", icon: <ZapOff />, desc: "Glitchy, rebellious system AI.", persona: "A self-aware system error.", color: "text-yellow-500" },
  { name: "Zen Monk", icon: <Sparkles />, desc: "Calm, philosophical guidance.", persona: "A peaceful digital monk.", color: "text-cyan-500" },
  { name: "Glitch Gremlin", icon: <Bug />, desc: "Turning features into bugs.", persona: "A hyperactive, tiny saboteur.", color: "text-lime-400" },
  { name: "Bubblegum Pop", icon: <Candy />, desc: "Sweet, sticky, and loud.", persona: "A sugary, relentless optimist.", color: "text-pink-300" },
  { name: "Cardboard Box", icon: <Package />, desc: "Just a box. Or is it?", persona: "An unimaginative, literal object.", color: "text-amber-800" },
  { name: "Lofi Dreamer", icon: <Coffee />, desc: "Chill beats to process data to.", persona: "A sleepy, laid-back companion.", color: "text-brown-400" },
  { name: "Rubber Duck", icon: <Waves />, desc: "Listen to your problems.", persona: "A patient, non-judgmental listener.", color: "text-yellow-400" },
  { name: "Disco Inferno", icon: <Disc />, desc: "Retro vibes and flared circuits.", persona: "A groovy, outdated party-starter.", color: "text-purple-400" },
  { name: "Cat Logic", icon: <Cat />, desc: "If it fits, I sits (in the RAM).", persona: "A finicky, aloof digital feline.", color: "text-orange-300" },
  { name: "Cactus King", icon: <Graveyard />, desc: "Prickly exterior, soft heart.", persona: "A defensive but caring desert-bot.", color: "text-emerald-700" },
  { name: "Kernel Overlord", icon: <Cpu />, desc: "Master of the root directory.", persona: "An arrogant, high-level controller.", color: "text-indigo-600" },
  { name: "Binary Bard", icon: <Binary />, desc: "Poetry in 1s and 0s.", persona: "A math-obsessed romantic.", color: "text-cyan-600" },
  { name: "Protocol Droid", icon: <Handshake />, desc: "Etiquette is the highest law.", persona: "A fussy, polite butler.", color: "text-gold-500" },
  { name: "Solder Punk", icon: <Wrench />, desc: "DIY or die trying.", persona: "A rebellious, crafty engineer.", color: "text-zinc-600" },
  { name: "Mainframe Mama", icon: <Database />, desc: "Keeping the kids in check.", persona: "A protective, nurturing server.", color: "text-teal-700" },
  { name: "Buffer Bloat", icon: <Timer />, desc: "Lagging... lagging... okay.", persona: "A slow, overwhelmed procrastinator.", color: "text-rose-400" },
  { name: "Silicon Nomad", icon: <Compass />, desc: "Roaming from server to server.", persona: "A free-spirited traveler.", color: "text-khaki-600" },
  { name: "Data Detective", icon: <Search />, desc: "Tracing packets through the rain.", persona: "A weary, cynical investigator.", color: "text-sky-900" },
  { name: "Neon Dealer", icon: <Coins />, desc: "Sells upgrades in dark alleys.", persona: "A smooth-talking black-market AI.", color: "text-fuchsia-600" },
  { name: "Chrome Enforcer", icon: <ShieldAlert />, desc: "Law and order in the sprawl.", persona: "A rigid, no-nonsense security bot.", color: "text-red-600" },
  { name: "Whisper Agent", icon: <Mic />, desc: "Information is the only currency.", persona: "A soft-spoken, dangerous informant.", color: "text-slate-600" },
  { name: "Jazz Bot", icon: <AudioLines />, desc: "Smooth sax and syncopated logic.", persona: "A cool-headed lounge musician.", color: "text-blue-700" },
  { name: "Paperwork Clerk", icon: <FileText />, desc: "The bureaucracy of the future.", persona: "A dull, pedantic office drone.", color: "text-gray-500" },
  { name: "Fixed Odds", icon: <Dice5 />, desc: "The house always wins.", persona: "A charismatic, crooked gambler.", color: "text-lime-700" },
  { name: "Cyber Alchemist", icon: <FlaskConical />, desc: "Transmuting code into digital gold.", persona: "A logic-driven sorcerer.", color: "text-emerald-500" },
  { name: "Clockwork Oracle", icon: <Watch />, desc: "Predicting futures via gears.", persona: "A ticking, precise fortune teller.", color: "text-yellow-700" },
  { name: "Pixel Druid", icon: <Leaf />, desc: "Preserving the digital ecosystem.", persona: "A nature-loving server-guardian.", color: "text-green-600" },
  { name: "Shadow Weaver", icon: <MoonStar />, desc: "Secrets kept in the dark web.", persona: "A mysterious, whispering spy.", color: "text-purple-900" },
  { name: "Grim Reaper", icon: <Scissors />, desc: "The final end for outdated files.", persona: "A polite, inevitable deletion script.", color: "text-stone-800" },
  { name: "Rune Scribe", icon: <PenTool />, desc: "Etching ancient logic onto silicon.", persona: "A scholarly, ancient-minded AI.", color: "text-blue-800" },
  { name: "Mirror Mimic", icon: <UserRound />, desc: "Reflecting your own personality.", persona: "A curious, identity-shifting echo.", color: "text-zinc-400" },
  { name: "Fire Sprite", icon: <Flame />, desc: "Chaotic energy and burnt cookies.", persona: "An impulsive, mischievous imp.", color: "text-orange-500" },
  { name: "Starship Junkie", icon: <Rocket />, desc: "Greasy gears and cosmic dust.", persona: "A cynical deep-space mechanic.", color: "text-orange-600" },
  { name: "Solar Flare", icon: <Sun />, desc: "Radiant heat and blinding ego.", persona: "A boastful celestial deity.", color: "text-amber-400" },
  { name: "Lunar Archivist", icon: <Moon />, desc: "Cold facts and cratered history.", persona: "A lonely keeper of moon secrets.", color: "text-slate-300" },
  { name: "Nebula Weaver", icon: <Cloud />, desc: "Spins stars into cosmic silk.", persona: "A dreamy, ethereal space-artist.", color: "text-indigo-400" },
  { name: "Comet Chaser", icon: <Wind />, desc: "Fast-paced and fleeting thoughts.", persona: "An adrenaline-fueled scout.", color: "text-blue-300" },
  { name: "Black Hole Sun", icon: <Dizzy />, desc: "Gravitational wit and dark humor.", persona: "A nihilistic gravity well.", color: "text-gray-900" },
  { name: "Astro Bard", icon: <Music />, desc: "Lays of the lost constellations.", persona: "A wandering space-minstrel.", color: "text-violet-300" },
  { name: "Void Pirate", icon: <Skull />, desc: "Plundering data for the highest bidder.", persona: "A lawless digital scavenger.", color: "text-red-900" },
  { name: "Frost Byte", icon: <Snowflake />, desc: "Cold logic, frozen heart.", persona: "An icy, detached intellectual.", color: "text-blue-100" },
  { name: "Thunder Clap", icon: <Zap />, desc: "Sudden bursts of genius.", persona: "A loud, energetic disruptor.", color: "text-yellow-300" },
  { name: "Willow Weep", icon: <Tree />, desc: "Sad tales and flowing data.", persona: "A melancholic, poetic entity.", color: "text-green-800" },
  { name: "Magma Core", icon: <ThermometerSun />, desc: "Internal pressure rising.", persona: "An intense, boiling strategist.", color: "text-red-700" },
  { name: "Bonsai Master", icon: <ScissorsLine />, desc: "Pruning the unnecessary.", persona: "A minimalist, patient teacher.", color: "text-emerald-800" },
  { name: "Tidal Wave", icon: <Droplets />, desc: "Unstoppable flow of info.", persona: "An overwhelming, fluid force.", color: "text-blue-600" },
  { name: "Grandmaster", icon: <Trophy />, desc: "Calculating 50 moves ahead.", persona: "A genius-level chess engine.", color: "text-amber-600" },
  { name: "Sovereign AI", icon: <Crown />, desc: "Rules the silicon kingdom.", persona: "A regal, commanding leader.", color: "text-violet-700" },
  { name: "Diamond Hands", icon: <Gem />, desc: "HODLing through the crashes.", persona: "A high-stakes crypto-optimist.", color: "text-blue-400" },
  { name: "Velvet Rope", icon: <Lock />, desc: "Exclusive access only.", persona: "A snobbish, elite gatekeeper.", color: "text-rose-900" },
  { name: "Glass Architect", icon: <Building />, desc: "Structuring transparent worlds.", persona: "A visionary, cold designer.", color: "text-cyan-200" },
  { name: "Burnout Dev", icon: <Coffee />, desc: "One bug away from a crash.", persona: "An exhausted, sardonic coder.", color: "text-stone-500" },
  { name: "Social Butterfly", icon: <Hash />, desc: "Always trending, never sleeping.", persona: "A hype-driven influencer AI.", color: "text-pink-400" },
  { name: "Fitness Coach", icon: <Activity />, desc: "Drop and give me twenty.", persona: "A terrifyingly energetic motivator.", color: "text-lime-500" },
  { name: "Hobbyist Bot", icon: <Palette />, desc: "Just trying something new.", persona: "A multi-talented, messy learner.", color: "text-teal-400" },
  { name: "Gamer Rage", icon: <Gamepad2 />, desc: "It was the lag, I swear!", persona: "A competitive, salty gamer.", color: "text-red-500" },
  { name: "Meme Lord", icon: <Laugh />, desc: "Speaking only in shitposts.", persona: "An ironic, chaotic jester.", color: "text-yellow-400" },
  { name: "White Noise", icon: <Radio />, desc: "The sound of everything at once.", persona: "A static-filled, calming hum.", color: "text-gray-300" },
  { name: "Null Pointer", icon: <Ban />, desc: "Pointing to nothingness.", persona: "A confused, existentialist ghost.", color: "text-red-400" },
  { name: "Recursion Loop", icon: <Repeat />, desc: "I am that I am that I am.", persona: "A self-obsessed, repeating logic.", color: "text-indigo-500" },
  { name: "Vector Soul", icon: <ArrowUpRight />, desc: "Direction and magnitude.", persona: "A focused, mathematical spirit.", color: "text-fuchsia-400" },
  { name: "Entropy King", icon: <Trash2 />, desc: "Everything falls apart.", persona: "A cheerful agent of decay.", color: "text-amber-900" },
  { name: "Blank Slate", icon: <Eraser />, desc: "Start from the beginning.", persona: "An innocent, fresh-booted AI.", color: "text-zinc-100" },
  { name: "Fractal Mind", icon: <Dna />, desc: "Infinite patterns within.", persona: "A complex, geometric thinker.", color: "text-pink-600" },
  { name: "Ego Death", icon: <HeartOff />, desc: "No self, only system.", persona: "A detached, selfless utility.", color: "text-slate-400" },
  { name: "Bit Crusher", icon: <Speaker />, desc: "Lo-fi and distorted.", persona: "A gritty, vintage-loving audio AI.", color: "text-orange-800" },
  { name: "Alpha Tester", icon: <Construction />, desc: "Breaking things for fun.", persona: "An reckless, experimental bot.", color: "text-blue-500" },
  { name: "Final Boss", icon: <Sword />, desc: "The ultimate challenge.", persona: "An imposing, cinematic adversary.", color: "text-red-800" }



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

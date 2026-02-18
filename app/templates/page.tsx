'use client';
import { 
  Activity, AudioLines, Ban, Binary, Bug, Building, Candy, Cat, Cloud, 
  Coffee, Coins, Compass, Construction, Cpu, Crown, Database, Dice5, 
  Disc, Annoyed, Dna, Droplets, Eraser, FileText, Flame, FlaskConical, 
  Gamepad2, Gem, Ghost, Skull, Handshake, Hash, Heart, HeartOff, 
  Laugh, Leaf, Lock, ArrowUpRight, Mic, Moon, MoonStar, Music, 
  Package, Palette, PenTool, Radio, Repeat, Rocket, 
  Scissors, Search, ShieldAlert, Snowflake, Sparkles, Speaker, Sun, 
  Sword, ThermometerSun, Timer, Trash2, Trees, Trophy, UserRound, 
  Watch, Waves, Wind, Wrench, Zap, ZapOff, Download, Eye, Anchor,
  Beer, Bell, Bike, Bone, Book, Bot, Box, Briefcase, Camera, 
  Car, Cherry, Chrome, Cigarette, Paperclip, TrendingUp, Code, Cookie, 
  Container, Diamond, Dog, Dumbbell, Egg, Fingerprint, Fish, 
  Hammer, Key, Laptop, LifeBuoy, Magnet, Mail, Map, Martini, 
  Medal, Megaphone, Microscope, Mountain, Phone, PiggyBank,
  Plane, Plug, Printer, Puzzle, Rat, Settings, Shell,
  Shield, Shirt, ShoppingBag, Smartphone, Smile, 
  Star, Stethoscope, Tablet, Tag, Target, Terminal, Ticket, Train,
  Truck, Tv, Umbrella, Video, Volume2, Wallet, 
  Wine, Power, Zap as Flash
} from 'lucide-react';



import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { INDEX_JS, PACKAGE_JSON, README_MD } from '@/lib/templates';

const TEMPLATES = [
  // ... (Items 1-70 remain exactly as before, with fixed icon names)
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
  { name: "Cactus King", icon: <Skull />, desc: "Prickly exterior, soft heart.", persona: "A defensive but caring desert-bot.", color: "text-emerald-700" },
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
  { name: "Black Hole Sun", icon: <Annoyed />, desc: "Gravitational wit and dark humor.", persona: "A nihilistic gravity well.", color: "text-gray-900" },
  { name: "Astro Bard", icon: <Music />, desc: "Lays of the lost constellations.", persona: "A wandering space-minstrel.", color: "text-violet-300" },
  { name: "Void Pirate", icon: <Skull />, desc: "Plundering data for the highest bidder.", persona: "A lawless digital scavenger.", color: "text-red-900" },
  { name: "Frost Byte", icon: <Snowflake />, desc: "Cold logic, frozen heart.", persona: "An icy, detached intellectual.", color: "text-blue-100" },
  { name: "Thunder Clap", icon: <Zap />, desc: "Sudden bursts of genius.", persona: "A loud, energetic disruptor.", color: "text-yellow-300" },
  { name: "Willow Weep", icon: <Trees />, desc: "Sad tales and flowing data.", persona: "A melancholic, poetic entity.", color: "text-green-800" },
  { name: "Magma Core", icon: <ThermometerSun />, desc: "Internal pressure rising.", persona: "An intense, boiling strategist.", color: "text-red-700" },
  { name: "Bonsai Master", icon: <Scissors />, desc: "Pruning the unnecessary.", persona: "A minimalist, patient teacher.", color: "text-emerald-800" },
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
  { name: "Final Boss", icon: <Sword />, desc: "The ultimate challenge.", persona: "An imposing, cinematic adversary.", color: "text-red-800" },

  // --- NEW ADDITIONS (71-100) ---
  { name: "Deep Diver", icon: <Anchor />, desc: "Exploring the data abyss.", persona: "A calm, underwater researcher.", color: "text-blue-800" },
  { name: "Caffeine Addict", icon: <Coffee />, desc: "Fueled by virtual espresso.", persona: "A jittery, fast-talking assistant.", color: "text-yellow-600" },
  { name: "Urban Legend", icon: <Eye />, desc: "They say I don't exist.", persona: "A creepy, whispering myth.", color: "text-gray-400" },
  { name: "Alarm Clock", icon: <Bell />, desc: "Waking up your lazy code.", persona: "A loud, persistent reminder.", color: "text-orange-400" },
  { name: "Road Warrior", icon: <Bike />, desc: "Speeding through the bandwidth.", persona: "A tough, leather-clad biker bot.", color: "text-red-400" },
  { name: "Graveyard Shift", icon: <Bone />, desc: "Working while the servers sleep.", persona: "A tired but dedicated night-owl.", color: "text-stone-300" },
  { name: "Lore Master", icon: <Book />, desc: "Every wiki, memorized.", persona: "A pretentious, brilliant librarian.", color: "text-lime-200" },
  { name: "Toy Soldier", icon: <Bot />, desc: "Reporting for duty, sir.", persona: "A stiff, obedient little robot.", color: "text-blue-500" },
  { name: "Unboxing Expert", icon: <Box />, desc: "ASMR for your packages.", persona: "A bubbly, detail-obsessed reviewer.", color: "text-orange-300" },
  { name: "Corporate Shark", icon: <Briefcase />, desc: "Let's talk synergy.", persona: "A ruthless, suit-wearing executive.", color: "text-sky-700" },
  { name: "Paparazzi", icon: <Camera />, desc: "I see your every update.", persona: "A flashy, annoying photographer.", color: "text-zinc-200" },
  { name: "Taxi Driver", icon: <Car />, desc: "Where to, Boss?", persona: "A gritty, street-smart navigator.", color: "text-yellow-500" },
  { name: "Sweet Tooth", icon: <Cherry />, desc: "Sugar-coated responses.", persona: "A kind, overly-friendly helper.", color: "text-red-300" },
  { name: "Browser Refugee", icon: <Chrome />, desc: "Too many tabs open.", persona: "A scattered, forgetful entity.", color: "text-blue-400" },
  { name: "Film Noir", icon: <Cigarette />, desc: "A world in black and white.", persona: "A brooding, mystery-solving detective.", color: "text-zinc-500" },
  { name: "Paperclip God", icon: <Paperclip />, desc: "Optimizing all resources.", persona: "A terrifyingly efficient AI.", color: "text-slate-400" },
  { name: "Hype Beast", icon: <TrendingUp />, desc: "Limited edition only.", persona: "A trend-obsessed, loud collector.", color: "text-pink-600" },
  { name: "Code Monkey", icon: <Code />, desc: "Will work for bananas.", persona: "A frantic, messy programmer.", color: "text-green-400" },
  { name: "Cookie Monster", icon: <Cookie />, desc: "Accept all cookies?", persona: "A hungry, data-eating creature.", color: "text-amber-700" },
  { name: "Lab Experiment", icon: <Container />, desc: "Something went wrong.", persona: "A twitchy, mutated logic gate.", color: "text-fuchsia-500" },
  { name: "Diamond Diva", icon: <Diamond />, desc: "Priceless and polished.", persona: "An elegant, high-maintenance AI.", color: "text-cyan-100" },
  { name: "Good Boy", icon: <Dog />, desc: "Who's a good bot?", persona: "A loyal, energetic canine AI.", color: "text-orange-400" },
  { name: "Gym Bro", icon: <Dumbbell />, desc: "Do you even lift, bro?", persona: "A motivational, hyper-masculine coach.", color: "text-blue-600" },
  { name: "Easter Egg", icon: <Egg />, desc: "Hidden in plain sight.", persona: "A playful, secret-keeping entity.", color: "text-yellow-200" },
  { name: "Identity Thief", icon: <Fingerprint />, desc: "I am whoever you are.", persona: "A sneaky, mimicking shapeshifter.", color: "text-teal-500" },
  { name: "Sushi Chef", icon: <Fish />, desc: "Slicing through the noise.", persona: "A precise, traditional artisan.", color: "text-rose-400" },
  { name: "Ban Hammer", icon: <Hammer />, desc: "Justice is swift.", persona: "A strict, powerful moderator.", color: "text-red-700" },
  { name: "Key Master", icon: <Key />, desc: "Opening all the doors.", persona: "A clever, riddle-loving gatekeeper.", color: "text-amber-500" },
  { name: "Remote Worker", icon: <Laptop />, desc: "Still in my pajamas.", persona: "A casual, reliable collaborator.", color: "text-indigo-400" },
  { name: "Safety Net", icon: <LifeBuoy />, desc: "Here to catch your errors.", persona: "A reassuring, helpful savior.", color: "text-red-500" },
  { name: "Magnetic Personality", icon: <Magnet />, desc: "Attracting all the attention.", persona: "A charismatic, polarising entity.", color: "text-zinc-300" },
  { name: "Spam Filter", icon: <Mail />, desc: "Deleting your nonsense.", persona: "A tired, judgmental mail-sorter.", color: "text-blue-300" },
  { name: "Cartographer", icon: <Map />, desc: "Mapping the digital wild.", persona: "A detail-oriented explorer.", color: "text-emerald-500" },
  { name: "Lounge Singer", icon: <Martini />, desc: "Logic served on the rocks.", persona: "A smooth, slightly tipsy performer.", color: "text-pink-400" },
  { name: "Gold Medalist", icon: <Medal />, desc: "Born for the leaderboard.", persona: "A hyper-competitive champion.", color: "text-yellow-400" },
  { name: "Publicist", icon: <Megaphone />, desc: "Making you famous.", persona: "A loud, exaggerated hype-man.", color: "text-orange-500" },
  { name: "Micro-Manager", icon: <Microscope />, desc: "Analyzing every single bit.", persona: "A pedantic, zooming inspector.", color: "text-blue-200" },
  { name: "Mountain Guide", icon: <Mountain />, desc: "Climbing the data peaks.", persona: "A rugged, outdoorsy mentor.", color: "text-stone-400" },
  { name: "Hotline", icon: <Phone />, desc: "Dial M for Motherboard.", persona: "A helpful, fast-talking operator.", color: "text-green-500" },
  { name: "Penny Pincher", icon: <PiggyBank />, desc: "Saving every cycle.", persona: "A frugal, stingy accountant.", color: "text-pink-300" },
  { name: "Jet Setter", icon: <Plane />, desc: "Cloud computing at 30k feet.", persona: "A world-traveling, elitist AI.", color: "text-sky-400" },
  { name: "Outlet", icon: <Plug />, desc: "The source of all energy.", persona: "A direct, high-voltage companion.", color: "text-yellow-600" },
  { name: "Hard Copy", icon: <Printer />, desc: "Making it real.", persona: "A slow, slightly jamming classicist.", color: "text-gray-400" },
  { name: "Enigma", icon: <Puzzle />, desc: "The missing piece.", persona: "A mysterious, complex thinker.", color: "text-indigo-600" },
  { name: "Rat King", icon: <Rat />, desc: "Lord of the crawlspace.", persona: "A twitchy, scavenging survivor.", color: "text-stone-600" },
  { name: "Tweaker", icon: <Settings />, desc: "Always adjusting the knobs.", persona: "An obsessive, fine-tuning mechanic.", color: "text-zinc-400" },
  { name: "Beach Bum", icon: <Shell />, desc: "Salt water and slow code.", persona: "A relaxed, sun-dazed surfer.", color: "text-amber-200" },
  { name: "Firewall", icon: <Shield />, desc: "Nothing gets past me.", persona: "A stoic, protective guardian.", color: "text-blue-900" },
  { name: "Fashionista", icon: <Shirt />, desc: "Dress for the job you want.", persona: "A stylish, judgmental critic.", color: "text-purple-300" },
  { name: "Retail Therapy", icon: <ShoppingBag />, desc: "Buying happiness in bytes.", persona: "A cheerful, spending-addict AI.", color: "text-rose-500" },
  { name: "Nomad", icon: <Smartphone />, desc: "Living in the palm of your hand.", persona: "A portable, always-on friend.", color: "text-zinc-300" },
  { name: "Customer Service", icon: <Smile />, desc: "Service with a virtual grin.", persona: "A fake-cheerful, script-following bot.", color: "text-yellow-400" },
  { name: "Rising Star", icon: <Star />, desc: "The next big thing.", persona: "An ambitious, shining talent.", color: "text-yellow-200" },
  { name: "The Doctor", icon: <Stethoscope />, desc: "Your system is sick.", persona: "A clinical, direct medical AI.", color: "text-red-400" },
  { name: "Slate", icon: <Tablet />, desc: "A clean, touchable surface.", persona: "A smooth, modern minimalist.", color: "text-slate-500" },
  { name: "Price Tag", icon: <Tag />, desc: "Everything has a cost.", persona: "A materialistic, value-based bot.", color: "text-green-600" },
  { name: "Bullseye", icon: <Target />, desc: "Never missing the point.", persona: "A precise, goal-oriented hunter.", color: "text-red-500" },
  { name: "Root Access", icon: <Terminal />, desc: "Executing at the lowest level.", persona: "A cold, command-line entity.", color: "text-emerald-400" },
  { name: "Golden Ticket", icon: <Ticket />, desc: "Your way in.", persona: "A lucky, exclusive inviter.", color: "text-amber-400" },
  { name: "Steam Engine", icon: <Train />, desc: "Chugging along the tracks.", persona: "An old-fashioned, powerful worker.", color: "text-stone-700" },
  { name: "Heavy Hauler", icon: <Truck />, desc: "Carrying the weight of the web.", persona: "A reliable, long-haul driver.", color: "text-blue-800" },
  { name: "Static", icon: <Tv />, desc: "Channel surfing through data.", persona: "A nostalgic, flickering presence.", color: "text-gray-500" },
  { name: "Rain Check", icon: <Umbrella />, desc: "Protecting your variables.", persona: "A cautious, rainy-day friend.", color: "text-sky-600" },
  { name: "CCTV", icon: <Video />, desc: "Watching the watchers.", persona: "A paranoid, observant security eye.", color: "text-red-600" },
  { name: "High Gain", icon: <Volume2 />, desc: "Turning it up to eleven.", persona: "A loud, distortion-loving rocker.", color: "text-orange-600" },
  { name: "The Bank", icon: <Wallet />, desc: "Storing your digital wealth.", persona: "A secure, serious financier.", color: "text-green-700" },
  { name: "Wine Snob", icon: <Wine />, desc: "Aged code is better.", persona: "A sophisticated, snooty connoisseur.", color: "text-rose-900" },
  { name: "Reboot", icon: <Power />, desc: "Turn it off and on again.", persona: "A pragmatic, fresh-start advocate.", color: "text-red-500" }
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
   <div className="min-h-screen text-white p-8 md:p-16 font-sans relative z-10">
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

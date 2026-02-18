'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BookOpen, Code2, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={14}/> },
    { name: 'Templates', href: '/templates', icon: <LayoutGrid size={14}/> },
    { name: 'Guide', href: '/guide', icon: <BookOpen size={14}/> },
    { name: 'Code', href: '/code', icon: <Code2 size={14}/> },
  ];

  return (
    <nav className="fixed top-6 right-6 z-[100] flex gap-2">
      {navLinks.filter(link => link.href !== pathname).map((link) => (
        <Link 
          key={link.href}
          href={link.href}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-xl"
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </nav>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CodeXml, Route, Sparkles, Book, Languages, Database, Wrench, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/career-paths', label: 'Career Paths', icon: Route },
  { href: '/project-generator', label: 'Project Generator', icon: Sparkles },
  { href: '/summarizer', label: 'AI Summarizer', icon: Book },
  { href: '/languages', label: 'Languages', icon: Languages },
  { href: '/databases', label: 'Databases', icon: Database },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <CodeXml className="h-8 w-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
          </div>
          <span className="text-2xl font-bold font-headline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tech Innovers
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
            <Link href="/career-paths" className="flex items-center gap-2">
              <Route className="transition-transform duration-300 group-hover:scale-110"/> Career Paths
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
            <Link href="/project-generator" className="flex items-center gap-2">
              <Sparkles className="transition-transform duration-300 group-hover:scale-110"/> Project Generator
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all duration-300">
            <Link href="/summarizer" className="flex items-center gap-2">
              <Book className="transition-transform duration-300 group-hover:scale-110"/> AI Summarizer
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
            <Link href="/languages">Programming Languages</Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300">
            <Link href="/databases">Databases</Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
            <Link href="/tools">Tools Explorer</Link>
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-blue-200 hover:border-purple-300 transition-all duration-300">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link, index) => (
                  <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl p-3 text-lg font-medium text-muted-foreground transition-all hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 animate-slide-in-right",
                          pathname === link.href && "bg-gradient-to-r from-blue-100 to-purple-100 text-primary"
                        )}
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

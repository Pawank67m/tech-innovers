'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Palette, Shield, Cpu } from 'lucide-react';

export function ThemeToggle() {
  const [isTransformersTheme, setIsTransformersTheme] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('transformers-theme');
    if (saved === 'true') {
      setIsTransformersTheme(true);
      document.documentElement.classList.add('transformers-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isTransformersTheme;
    setIsTransformersTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('transformers-theme');
      localStorage.setItem('transformers-theme', 'true');
    } else {
      document.documentElement.classList.remove('transformers-theme');
      localStorage.setItem('transformers-theme', 'false');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`relative overflow-hidden transition-all duration-300 ${
        isTransformersTheme 
          ? 'transformers-button border-cyan-500 text-white' 
          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
      }`}
    >
      {isTransformersTheme ? (
        <>
          <Shield className="h-4 w-4 mr-2 text-cyan-400" />
          <span className="matrix-text text-xs">AUTOBOTS</span>
        </>
      ) : (
        <>
          <Palette className="h-4 w-4 mr-2" />
          <span>Default</span>
        </>
      )}
      {isTransformersTheme && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
      )}
    </Button>
  );
}
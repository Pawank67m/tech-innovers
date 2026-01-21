'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Palette } from 'lucide-react';

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
      className={isTransformersTheme ? 'transformers-button' : ''}
    >
      {isTransformersTheme ? (
        <>
          <Zap className="h-4 w-4 mr-2" />
          Transformers
        </>
      ) : (
        <>
          <Palette className="h-4 w-4 mr-2" />
          Default
        </>
      )}
    </Button>
  );
}
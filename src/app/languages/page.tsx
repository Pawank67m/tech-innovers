
'use client';

import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LanguagesPage() {
  const [isTransformersTheme, setIsTransformersTheme] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const languages = tools.filter(tool => tool.category === 'Programming Language');

  useEffect(() => {
    const checkTheme = () => {
      const hasTransformersTheme = document.documentElement.classList.contains('transformers-theme');
      setIsTransformersTheme(hasTransformersTheme);
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isTransformersTheme ? 'transformers-bg-tools' : ''}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isTransformersTheme ? 'transformers-bg-tools' : ''}`}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold font-headline ${isTransformersTheme ? 'energon-text' : ''}`}>
            Programming Languages
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Explore foundational programming languages for various tech domains.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map((language) => (
            <ToolCard key={language.slug} tool={language} />
          ))}
        </div>
      </div>
    </div>
  );
}

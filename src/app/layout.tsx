
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { TechNewsBot } from '@/components/tech-news-bot';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Tech Innovers',
  description: 'Explore technology domains, discover career paths, and accelerate your tech journey with AI-powered tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden')}>
        <AuthProvider>
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float"></div>
          </div>
          
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Toaster />
          <TechNewsBot />
        </AuthProvider>
      </body>
    </html>
  );
}

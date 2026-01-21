
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Domain } from '@/lib/domains';

type DomainCardProps = {
  domain: Domain;
};

const gradientClasses = [
  'from-blue-500 to-purple-600',
  'from-purple-500 to-pink-500',
  'from-pink-500 to-orange-500',
  'from-green-400 to-emerald-500',
  'from-cyan-400 to-blue-500',
  'from-orange-400 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-emerald-400 to-cyan-500',
];

// Transformers-themed gradients
const transformersGradients = [
  'from-transformers-optimus-blue to-transformers-optimus-red',
  'from-transformers-energon-cyan to-transformers-matrix-gold',
  'from-transformers-bumblebee-yellow to-transformers-battle-orange',
  'from-transformers-decepticon-purple to-transformers-steel-gray',
  'from-transformers-optimus-blue to-transformers-energon-cyan',
  'from-transformers-matrix-gold to-transformers-battle-orange',
  'from-transformers-decepticon-purple to-transformers-optimus-red',
  'from-transformers-energon-cyan to-transformers-spark-white',
];

export function DomainCard({ domain }: DomainCardProps) {
  const Icon = domain.icon;
  const gradientClass = gradientClasses[Math.abs(domain.name.length) % gradientClasses.length];
  const transformersGradient = transformersGradients[Math.abs(domain.name.length) % transformersGradients.length];

  return (
    <Link href={`/domain/${domain.slug}`} className="group">
      <Card className="h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-glow group-hover:shadow-blue-500/25 overflow-hidden relative transformers-theme:transformers-card transformers-theme:hover:shadow-cyan-500/50 transformers-theme:hover:shadow-2xl transformers-theme:bg-transparent">
        
        {/* Default Theme Effects */}
        <div className="transformers-theme:hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px] rounded-lg">
            <div className={`absolute inset-[1px] bg-gradient-to-r ${gradientClass} rounded-lg opacity-20`}></div>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="shimmer"></div>
          </div>
        </div>

        {/* Transformers Theme Effects */}
        <div className="hidden transformers-theme:block">
          {/* Epic Transformers hover effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700" />
          </div>
          
          {/* Battle damage effects */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <CardHeader className="flex-row items-center gap-4 relative z-10">
          <div className={`bg-gradient-to-r ${gradientClass} transformers-theme:bg-gradient-to-br transformers-theme:${transformersGradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 transformers-theme:border transformers-theme:border-cyan-500/30 transformers-theme:shadow-cyan-500/20`}>
            <Icon className="h-8 w-8 text-white drop-shadow-sm transformers-theme:text-cyan-100 transformers-theme:drop-shadow-lg transformers-theme:drop-shadow-cyan-500/50" />
          </div>
          <CardTitle className="font-headline text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 transformers-theme:text-cyan-100 transformers-theme:group-hover:from-cyan-400 transformers-theme:group-hover:to-yellow-400 transformers-theme:drop-shadow-md">
            {domain.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="group-hover:text-gray-700 transition-colors duration-300 transformers-theme:text-slate-300 transformers-theme:group-hover:text-cyan-200">
            {domain.description}
          </CardDescription>
          
          {/* Default Theme Floating Particles */}
          <div className="transformers-theme:hidden">
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            <div className="absolute top-1/2 -left-1 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-1 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Transformers Theme Energon Effects */}
          <div className="hidden transformers-theme:block">
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 shadow-lg shadow-cyan-500/50"></div>
            <div className="absolute top-1/2 -left-1 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 shadow-lg shadow-yellow-500/50" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-1 right-1/3 w-1.5 h-1.5 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 shadow-lg shadow-red-500/50" style={{animationDelay: '1s'}}></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

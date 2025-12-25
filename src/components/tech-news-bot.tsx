'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { getTechNewsUpdate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  content: string | React.ReactNode;
  sender: 'user' | 'bot';
};

export function TechNewsBot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', content: "Hi! I'm Techie, your friendly tech news bot. Ask me anything about the latest in tech!" },
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    const result = await getTechNewsUpdate({ query });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => [...prev, { sender: 'bot', content: "Sorry, I'm having trouble fetching the news right now. Please try again later." }]);
    } else if (result.data) {
        const botResponse = result.data;
        const botMessageContent = (
            <div className="space-y-3">
                <p className="text-sm">{botResponse.intro}</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {botResponse.news.map((item, index) => (
                        <div key={index} className="p-3 rounded-md border bg-background/70 text-card-foreground text-left">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            {item.source && <p className="text-xs text-muted-foreground/80 mb-1">{item.source}</p>}
                            <p className="text-xs">{item.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
        const botMessage: Message = { sender: 'bot', content: botMessageContent };
        setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="rounded-full h-16 w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 animate-pulse-glow float">
            <Bot className="h-8 w-8 drop-shadow-sm" />
            <span className="sr-only">Open Tech News Bot</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[80vh] mr-4 p-0 flex flex-col bg-white/95 backdrop-blur-md border-0 shadow-2xl animate-scale-in">
          <header className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b-0">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-300 h-5 w-5 animate-pulse"/> 
              Tech News Bot
            </h3>
          </header>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3 animate-fade-in-up', message.sender === 'user' ? 'justify-end' : '')} style={{animationDelay: `${index * 0.1}s`}}>
                  {message.sender === 'bot' && (
                    <Avatar className='h-8 w-8 shrink-0 ring-2 ring-purple-200'>
                      <AvatarFallback className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                        <Bot className='h-5 w-5'/>
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md',
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                  )}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 animate-fade-in">
                   <Avatar className='h-8 w-8 ring-2 ring-purple-200'>
                      <AvatarFallback className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                        <Bot className='h-5 w-5'/>
                      </AvatarFallback>
                    </Avatar>
                   <p className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin text-purple-500" /> 
                     <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thinking...</span>
                   </p>
                 </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about tech news..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

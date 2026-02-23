'use client';

/**
 * Élan AI Assistant Widget — B2C (UHNI)
 * Floating chat always available on all B2C pages
 * Calm, discreet, never intrusive
 * Mock responses — simulates AGI assistance
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const MOCK_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  { keywords: ['status', 'journey', 'where', 'progress'], response: "Your experience is actively being curated. Your advisor will be in touch within 24 hours with refined options for your consideration." },
  { keywords: ['when', 'time', 'how long', 'wait'], response: "Your advisor typically makes contact within 24 hours of intent submission. We never rush — every detail is attended to with complete care." },
  { keywords: ['hotel', 'stay', 'accommodation', 'suite'], response: "Your accommodation preferences are fully reflected in your profile. Your advisor will present only the most aligned options — you will never see a long list." },
  { keywords: ['jet', 'flight', 'aviation', 'fly', 'aircraft'], response: "Private aviation arrangements are coordinated entirely by our operations team. All details will be confirmed before your departure — without you needing to coordinate anything." },
  { keywords: ['privacy', 'discretion', 'private', 'secure'], response: "Your privacy is our highest principle. Your movements, preferences, and arrangements are known only to your Élan team — and only to those who need to know." },
  { keywords: ['payment', 'cost', 'price', 'confirm', 'pay'], response: "Financial confirmation is always a private, seamless step — handled through your pre-authorized account or a secure link from your advisor. Never a retail checkout." },
  { keywords: ['advisor', 'rm', 'contact', 'speak', 'call'], response: "Your dedicated advisor is available via the Messages section. For urgent matters, they will always respond within the hour." },
  { keywords: ['help', 'assist', 'support', 'question'], response: "I'm here for anything you need — journey status, advisor contact, privacy settings, or any question about your Élan experience." },
];

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = MOCK_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  return match?.response ?? "I'm here to assist with your Élan experience. For specific journey details, your advisor is the finest resource — or feel free to ask me anything.";
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'assistant',
  text: `${getTimeGreeting()}. I'm your Élan assistant. How may I assist with your experience today?`,
  timestamp: new Date(),
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChatted, setHasChatted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 700));

    const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', text: getMockResponse(text), timestamp: new Date() };
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden"
          >
            <div
              className="relative h-20 bg-cover bg-center flex items-center px-4 gap-3"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=400&q=80)` }}
            >
              <div className="absolute inset-0 bg-rose-900/80" />
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-amber-300" />
                  </div>
                  <div>
                    <p className="text-white font-sans text-sm font-semibold">Elan Assistant</p>
                    <p className="text-white/60 text-xs">Always here for you</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
              </div>
            </div>

            <div className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-sand-50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl font-sans text-sm leading-relaxed',
                    msg.role === 'user' ? 'bg-rose-900 text-white rounded-br-sm' : 'bg-white border border-sand-200 text-rose-900 rounded-bl-sm shadow-sm'
                  )}>{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-sand-200 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t border-sand-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 text-sm font-sans px-3 py-2 rounded-lg bg-sand-50 border border-sand-200 text-rose-900 placeholder-sand-400 focus:outline-none focus:border-rose-300"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={cn('p-2 rounded-lg transition-colors', inputValue.trim() && !isTyping ? 'bg-rose-900 text-white hover:bg-rose-800' : 'bg-sand-100 text-sand-300 cursor-not-allowed')}
              ><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setIsOpen(!isOpen); setHasChatted(true); }}
        className="w-14 h-14 bg-gradient-to-br from-rose-800 to-rose-950 text-white rounded-full shadow-xl shadow-rose-900/40 hover:shadow-rose-900/60 hover:scale-105 transition-all flex items-center justify-center border border-rose-700/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen && !hasChatted ? { boxShadow: ['0 0 0 0 rgba(136,19,55,0.4)', '0 0 0 8px rgba(136,19,55,0)', '0 0 0 0 rgba(136,19,55,0)'] } : {}}
        transition={!isOpen && !hasChatted ? { repeat: Infinity, duration: 2.5 } : {}}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>
    </div>
  );
}

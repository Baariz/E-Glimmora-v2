'use client';

/**
 * Élan AGI Assistant — RM / Advisor Mode
 * Floating assistant for the B2B side
 * Professional dark theme — helps advisor with curation decisions
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

const RM_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  { keywords: ['brief', 'agi', 'recommendation'], response: "The AGI brief is ready on the governance page. Top recommendation: Aman Venice — Privacy Score 96, Emotional Match 94. One strong alternative: Hotel de Crillon." },
  { keywords: ['client', 'profile', 'preference'], response: "This client's emotional profile shows strong preference for Privacy (89/100) and Legacy (82/100). Wellness journeys score highest for alignment. Avoid high-visibility venues." },
  { keywords: ['risk', 'exposure', 'safety'], response: "Current risk assessment for the proposed travel window: Low. No known geopolitical events. Political stability: Stable. Media exposure risk: Minimal." },
  { keywords: ['hotel', 'accommodation', 'stay', 'property'], response: "Based on the client's discretion tier (High), Aman Venice is the strongest option. Hotel de Crillon is a solid secondary. Four Seasons George V carries medium exposure risk." },
  { keywords: ['vendor', 'screening', 'nda'], response: "All shortlisted vendors have passed financial and security screening. NDA status: confirmed across all. SLA compliance: 98% over last 12 months." },
  { keywords: ['depart', 'brief', 'send', 'prepare'], response: "The AGI template for the pre-departure brief is available on the journey detail page. It includes arrival arrangements, contact details, and discretion-level notes." },
  { keywords: ['season', 'when', 'timing', 'date'], response: "The client's preferred season is Spring, with Autumn as a secondary. Current journey window aligns well. No conflicting events detected in the proposed period." },
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = RM_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  return match?.response ?? "I'm ready to assist with this client's journey curation. Ask me about the AGI brief, risk assessment, vendor status, or pre-departure brief.";
}

const INITIAL: ChatMessage = { id: 'init', role: 'assistant', text: 'RM Assistant ready. I have reviewed the client profile and AGI brief. How can I assist with this journey?' };

export function RMChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600));

    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: getResponse(text) }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
          >
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div>
                <p className="font-sans text-sm font-medium text-white">{'\u25C8'} AGI Assistant</p>
                <p className="font-sans text-xs text-slate-400">RM Mode — Internal</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[85%] px-3 py-2 rounded-xl font-sans text-sm leading-relaxed', msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-700 text-slate-200 rounded-bl-sm')}>{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-3 py-2 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="px-3 py-3 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about client, brief, risk..." className="flex-1 text-sm font-sans px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500" />
              <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className={cn('p-2 rounded-lg transition-colors', inputValue.trim() && !isTyping ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-700 text-slate-500 cursor-not-allowed')}><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <BrainCircuit size={20} />}
      </motion.button>
    </div>
  );
}

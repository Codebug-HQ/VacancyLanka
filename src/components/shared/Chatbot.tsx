'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Ayubowan! 🙏 I'm your VacayLanka assistant. How can I help you plan your trip today?", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Hide button when footer is in view (your existing logic)
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const handleGlobalScroll = () => {
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isFooterInView = footerRect.top < windowHeight && footerRect.bottom > 0;

      if (isFooterInView) {
        const scrollPosition = window.scrollY + windowHeight;
        const footerTop = footer.offsetTop;
        setShowButton(scrollPosition < footerTop);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener('scroll', handleGlobalScroll);
    handleGlobalScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: "That sounds like a wonderful plan! Our team specializes in that area. Would you like to see our latest packages?", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-4 z-[100] flex flex-col items-end gap-4 md:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-[92vw] max-w-sm sm:max-w-md md:w-[400px] h-[65vh] md:h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-slate-900 px-5 py-5 md:p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EF476F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm uppercase tracking-widest truncate">Vacay Bot</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/80 scrollbar-thin scrollbar-thumb-slate-300"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium break-words ${
                    msg.sender === 'user' 
                      ? 'bg-[#EF476F] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100/80 border-none rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF476F] transition-all"
              />
              <button 
                type="submit" 
                className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-[#EF476F] transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="py-4 px-7 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl relative overflow-hidden"
            >
              Let's <span className="text-[#EF476F] ml-1 font-bold">Talk</span>
              <MessageCircle size={28} className="ml-4 mr-1" />
              
              {!isOpen && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-3 right-5 text-[#EF476F]"
                >
                  <Sparkles size={16} fill="currentColor" />
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
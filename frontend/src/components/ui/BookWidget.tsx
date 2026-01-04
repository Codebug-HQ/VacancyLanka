'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardCheck, Send, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { request } from 'graphql-request';

interface BookWidgetProps {
  itinerary: {
    title: string;
    price?: string;
  };
  onClose: () => void;
}

const GET_OWNER_WHATSAPP = `
  query GetOwnerWhatsapp {
    ownerInfo {
      whatsapp
    }
  }
`;

export default function BookWidget({ itinerary, onClose }: BookWidgetProps) {
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [refCode] = useState(() => `VL-${Math.random().toString(36).toUpperCase().substring(7)}`);

  const [formData, setFormData] = useState({
    date: '',
    travelers: '',
    fullName: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    async function fetchWhatsapp() {
      try {
        const proxyUrl = `${window.location.origin}/api/graphql/proxy`;
        const data: any = await request(proxyUrl, GET_OWNER_WHATSAPP);
        setOwnerWhatsapp(data.ownerInfo.whatsapp);
      } catch (err) {
        console.error('Error fetching owner WhatsApp:', err);
      }
    }
    fetchWhatsapp();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date).getTime();
    if (!formData.date || selectedDate < today) return "Please select a valid future date.";
    if (!formData.travelers || parseInt(formData.travelers) < 1) return "Please enter travelers.";
    if (formData.fullName.trim().split(' ').length < 2) return "Please enter your full name (First & Last).";
    if (formData.whatsappNumber.length < 8) return "Please enter a valid WhatsApp number.";
    return null;
  };

  const handleFinalWhatsAppSend = () => {
    // Clean text-only template for 100% compatibility
    const messageText = `NEW BOOKING REQUEST
REF ID: #${refCode}
--------------------------
PACKAGE: ${itinerary.title}
DATE: ${formData.date}
TRAVELERS: ${formData.travelers}
CLIENT NAME: ${formData.fullName}
CONTACT: ${formData.whatsappNumber}
--------------------------
Note: This is a system-generated inquiry from the website. Please respond to confirm availability.`;

    const formattedPhone = ownerWhatsapp.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(messageText);

    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
    
    setStep('success');
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        <motion.div
          key={step}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-900" />
          </button>

          {step === 'form' && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="mb-8">
                <span className="text-[#EF476F] font-black text-xs uppercase tracking-widest">Inquiry Form</span>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{itinerary.title}</h4>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); const err = validateForm(); if(!err){ setStep('review'); } else { setError(err); } }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Travel Date</label>
                    <input required name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#EF476F] outline-none text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Travelers</label>
                    <input required name="travelers" type="number" placeholder="Count" value={formData.travelers} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#EF476F] outline-none text-slate-900" />
                  </div>
                </div>
                <input required name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#EF476F] outline-none text-slate-900" />
                <input required name="whatsappNumber" type="tel" placeholder="Your WhatsApp (+94...)" value={formData.whatsappNumber} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#EF476F] outline-none text-slate-900" />

                {error && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl"><AlertCircle size={16} /> {error}</div>}

                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#EF476F] transition-all">
                  Next Step <ChevronRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="mb-6">
                <span className="text-[#EF476F] font-black text-xs uppercase tracking-widest">Confirmation</span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">Review Details</h4>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 font-mono text-sm text-slate-600 mb-6">
                <p className="font-bold text-slate-900 mb-2 underline">BOOKING SUMMARY</p>
                <p>REF: #{refCode}</p>
                <p>ITINERARY: {itinerary.title}</p>
                <p>DATE: {formData.date}</p>
                <p>TRAVELERS: {formData.travelers}</p>
                <p>NAME: {formData.fullName}</p>
                <p className="mt-2 text-[10px] uppercase tracking-tighter">Verified by Vacay Lanka</p>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleFinalWhatsAppSend} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
                  Confirm & Open WhatsApp <Send size={20} />
                </button>
                <button onClick={() => setStep('form')} className="w-full text-slate-400 font-bold text-sm py-2 hover:text-slate-600 transition-colors">
                  Edit details
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck size={48} />
              </div>
              <h4 className="text-3xl font-black text-slate-900 mb-2">Almost Done!</h4>
              <p className="text-slate-500 px-6">Your WhatsApp has been opened. Please press the send button to submit your request.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
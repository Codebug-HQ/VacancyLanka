'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardCheck, Car, AlertCircle, ChevronRight, Send } from 'lucide-react';
import { request } from 'graphql-request';

interface ReserveWidgetProps {
  vehicle: {
    title: string;
    vehicleDetails: {
      pricePerDay: number;
      fuelType: string[];
    };
  };
  onClose: () => void;
  cleanFuelType: (fuelArray: string[]) => string;
}

const GET_OWNER_WHATSAPP = `
  query GetOwnerWhatsapp {
    ownerInfo {
      whatsapp
    }
  }
`;

export default function ReserveWidget({ vehicle, onClose, cleanFuelType }: ReserveWidgetProps) {
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [refCode] = useState(() => `RES-${Math.random().toString(36).toUpperCase().substring(7)}`);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: '',
    days: '1'
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
    const selectedDate = new Date(formData.startDate).getTime();

    if (formData.fullName.trim().split(' ').length < 2) return "Please enter your full name.";
    if (!formData.startDate || selectedDate < today) return "Please select a valid future date.";
    if (parseInt(formData.days) < 1) return "Duration must be at least 1 day.";
    if (formData.phone.length < 8) return "Please enter a valid phone number.";
    return null;
  };

  const handleFinalWhatsAppSend = () => {
    const messageText = `VEHICLE RESERVATION REQUEST
REF ID: #${refCode}
--------------------------
VEHICLE: ${vehicle.title}
PRICE: LKR ${vehicle.vehicleDetails.pricePerDay}/day
FUEL: ${cleanFuelType(vehicle.vehicleDetails.fuelType)}
--------------------------
START DATE: ${formData.startDate}
DURATION: ${formData.days} Day(s)
CLIENT: ${formData.fullName}
EMAIL: ${formData.email}
CONTACT: ${formData.phone}
--------------------------
Note: This is a system-generated inquiry from the website. Please confirm availability for these dates.`;

    const formattedPhone = ownerWhatsapp.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(messageText);

    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
    
    setStep('success');
    setTimeout(() => {
      onClose();
    }, 3500);
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#00251b]/60 backdrop-blur-md"
        />
        
        <motion.div
          key={step}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-[#00251b]" />
          </button>

          {step === 'form' && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#00251b] leading-tight">Book Reservation</h4>
                  <p className="text-slate-500 text-sm font-medium">{vehicle.title}</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); const err = validateForm(); if(!err){ setStep('review'); } else { setError(err); } }} className="space-y-4">
                <input required name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#00783e] outline-none text-[#00251b]" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00783e] uppercase ml-2">Pickup Date</label>
                    <input required name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#00783e] outline-none text-[#00251b]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00783e] uppercase ml-2">Duration (Days)</label>
                    <input required name="days" type="number" min="1" value={formData.days} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#00783e] outline-none text-[#00251b]" />
                  </div>
                </div>

                <input required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#00783e] outline-none text-[#00251b]" />
                <input required name="phone" type="tel" placeholder="WhatsApp Number (+94...)" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-[#00783e] outline-none text-[#00251b]" />

                {error && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl"><AlertCircle size={16} /> {error}</div>}

                <button type="submit" className="w-full bg-[#00783e] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-all">
                  Review Details <ChevronRight size={20} className="inline ml-1" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="mb-6">
                <span className="text-[#00783e] font-black text-xs uppercase tracking-widest">Confirmation</span>
                <h4 className="text-2xl font-black text-[#00251b] mt-1">Review Reservation</h4>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 font-mono text-sm text-slate-600 mb-6">
                <p className="font-bold text-[#00251b] mb-2 underline">VEHICLE SUMMARY</p>
                <p>REF: #{refCode}</p>
                <p>VEHICLE: {vehicle.title}</p>
                <p>DATE: {formData.startDate}</p>
                <p>DAYS: {formData.days} Day(s)</p>
                <p>TOTAL: LKR {vehicle.vehicleDetails.pricePerDay * parseInt(formData.days)}</p>
                <p className="mt-2 text-[10px] uppercase border-t border-slate-200 pt-2 tracking-tighter">Verified by Vacay Lanka</p>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleFinalWhatsAppSend} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
                  Confirm & Open WhatsApp <Send size={20} />
                </button>
                <button onClick={() => setStep('form')} className="w-full text-[#00783e] font-bold text-sm py-2 hover:text-slate-600 transition-colors">
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
              <h4 className="text-3xl font-black text-[#00251b] mb-2">Request Sent!</h4>
              <p className="text-slate-500 px-6">Please finish by clicking "Send" in WhatsApp to notify our team.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  User, 
  Send,
  CheckCircle2
} from 'lucide-react';
import Map from '@/components/shared/Map';
import { useLoading } from '@/context/LoadingContext';
import { graphqlClient } from '@/lib/graphql-client'; // Adjust path as needed

interface OwnerInfo {
  proprietor_name: string;
  phone_number: string;
  office_phone: string;
  office_address: string;
  whatsapp: string;
  fb_address: string;
  insta_address: string;
  linkedin_address: string;
  twitter_address: string;
  map_embedded_link: string;
}

export default function ContactSection() {
  const { startLoading, finishLoading } = useLoading();
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [data, setData] = useState<OwnerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();

      const query = `
        query GetFormFields {
          ownerInfo {
            proprietor_name
            phone_number
            office_phone
            office_address
            whatsapp
            fb_address
            insta_address
            linkedin_address
            twitter_address
            map_embedded_link
          }
        }
      `;

      try {
        const result = await graphqlClient.request<{ ownerInfo: OwnerInfo }>(query);
        setData(result.ownerInfo);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching contact info:", err);
        setError('Failed to load contact information');
      } finally {
        finishLoading();
      }
    };

    fetchData();
  }, [startLoading, finishLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');

    const formData = new FormData(e.currentTarget);

    // Honeypot check
    if (formData.get('website_url')) {
      setFormState('success');
      return;
    }

    const mutation = `
      mutation SendEnquiry($name: String!, $email: String!, $phone: String!, $message: String!) {
        sendEnquiry(input: { name: $name, email: $email, phone: $phone, message: $message }) {
          success
          message
        }
      }
    `;

    const variables = {
      name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const result = await graphqlClient.request(mutation, variables);

      if (result.sendEnquiry?.success) {
        setFormState('success');
      } else {
        throw new Error(result.sendEnquiry?.message || 'Failed to send enquiry');
      }
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setFormState('idle');
      alert('Could not send message. Please try again later.');
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null; // LoadingContext handles overlay
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#EF476F] font-bold tracking-[0.3em] uppercase text-sm"
        >
          Connect With Us
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter"
        >
          Start Your <span className="text-slate-400">Adventure</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
          >
            <h3 className="text-2xl font-black mb-8 tracking-tight">Direct Contact</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-2xl h-fit text-[#EF476F]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                    Office Address
                  </p>
                  <p className="text-sm font-medium">{data.office_address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-2xl h-fit text-[#EF476F]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                    Proprietor
                  </p>
                  <p className="font-bold">{data.proprietor_name}</p>
                  <p className="text-sm text-white/60">{data.phone_number}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-2xl h-fit text-[#EF476F]">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                    Office Line
                  </p>
                  <p className="font-bold">{data.office_phone}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-64 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
            <Map src={data.map_embedded_link} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 h-full">
            <AnimatePresence mode="wait">
              {formState !== 'success' ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        Your Name
                      </label>
                      <input
                        required
                        name="full_name"
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 ring-[#EF476F] outline-none shadow-sm font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        Email
                      </label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 ring-[#EF476F] outline-none shadow-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                      Phone Number
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="+94 7x xxx xxxx"
                      className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 ring-[#EF476F] outline-none shadow-sm font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                      How can we help?
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Tell us about your travel plans..."
                      className="w-full bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900 border-none rounded-2xl p-4 focus:ring-2 ring-[#EF476F] outline-none shadow-sm font-medium transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={formState === 'sending'}
                    className="cursor-pointer w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#EF476F] transition-all disabled:opacity-50 group"
                  >
                    {formState === 'sending' ? 'Sending...' : 'Send Enquiry'}
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500 font-medium max-w-sm">
                    Our travel experts will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="cursor-pointer mt-8 text-sm font-bold text-[#EF476F] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
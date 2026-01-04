'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { request } from 'graphql-request';
import Icon from '../ui/Icon';
import AnimatedHamburger from '../ui/AnimatedHamburger';
// Removed useLoading import to stop global interruptions
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

const GET_NAVIGATION = `
  query Navigation {
    ownerInfo {
      email
      whatsapp
      fb_address
      insta_address
      twitter_address
      linkedin_address
      map_embedded_link
    }
    activities (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
    packages (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
    itineraries (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
  }
`;

interface NavItem {
  title: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<'packages' | 'activities' | null>(null);
  const [packages, setPackages] = useState<NavItem[]>([]);
  const [activities, setActivities] = useState<NavItem[]>([]);
  const [ownerData, setOwnerData] = useState<any>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    // Only fetch if menu is opened and we don't have data yet
    if (!isOpen || (packages.length > 0 && activities.length > 0 && ownerData)) return;

    async function fetchMenuData() {
      try {
        setIsLocalLoading(true); // Only local state, no global loading context
        
        const proxyUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/api/graphql/proxy` 
          : '/api/graphql/proxy';

        const data: any = await request(proxyUrl, GET_NAVIGATION);

        setOwnerData(data.ownerInfo);

        const combinedPackages = [
          ...(data.packages?.nodes || []),
          ...(data.itineraries?.nodes || []),
        ].map((node: any) => ({ title: node.title, href: '#packages' }));

        const mappedActivities = (data.activities?.nodes || []).map((node: any) => ({
          title: node.title,
          href: '#activities',
        }));

        setPackages(combinedPackages);
        setActivities(mappedActivities);
      } catch (err) {
        console.error('Mobile Menu Fetch Error:', err);
      } finally {
        setIsLocalLoading(false);
      }
    }

    fetchMenuData();
  }, [isOpen, packages.length, activities.length, ownerData]);

  const toggleSection = (section: 'packages' | 'activities') => {
    setOpenSection(openSection === section ? null : section);
  };

  const menuLinkStyle = "text-white text-3xl font-bold hover:text-[#EF476F] transition-colors block tracking-tighter w-full text-left py-4";
  const accordionTitleStyle = "text-white text-3xl font-bold hover:text-[#EF476F] transition-colors flex items-center justify-between py-4 cursor-pointer";
  const subLinkStyle = "text-zinc-400 text-lg py-2 hover:text-[#EF476F] transition-colors block pl-8 border-l border-white/5 ml-2 my-1";
  const socialIconStyle = "p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-[#EF476F] hover:bg-white/10 transition-all flex items-center justify-center";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[140] lg:hidden"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-[85%] sm:w-[65%] bg-[#0f172b] z-[150] shadow-2xl lg:hidden border-l border-white/5 overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#0f172b]/80 backdrop-blur-lg px-8 py-6 flex justify-between items-center border-b border-white/5 z-[160]">
              <span className="text-white font-black tracking-tighter text-xl">
                VACAY<span className="text-[#EF476F]">LANKA</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 bg-white/5 rounded-full hover:bg-[#EF476F]/20 transition-colors"
              >
                <AnimatedHamburger isOpen={isOpen} />
              </button>
            </div>

            <div className="flex flex-col min-h-[calc(100%-80px)] px-8 pb-10 pt-4">
              <nav className="flex flex-col">
                <Link href="#hero" onClick={() => setIsOpen(false)} className={menuLinkStyle}>Home</Link>

                {/* Packages Accordion */}
                <div onClick={() => toggleSection('packages')} className={accordionTitleStyle}>
                  Packages
                  <motion.div animate={{ rotate: openSection === 'packages' ? 180 : 0, color: openSection === 'packages' ? '#EF476F' : '#ffffff' }}>
                    <Icon type="chevron" className="w-6 h-6" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {openSection === 'packages' && packages.length > 0 && (
                    <motion.ul
                      key="packages-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {packages.map((item, i) => (
                        <motion.li key={`pkg-${i}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                          <Link href={item.href} onClick={() => setIsOpen(false)} className={subLinkStyle}>{item.title}</Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {/* Activities Accordion */}
                <div onClick={() => toggleSection('activities')} className={accordionTitleStyle}>
                  Activities
                  <motion.div animate={{ rotate: openSection === 'activities' ? 180 : 0, color: openSection === 'activities' ? '#EF476F' : '#ffffff' }}>
                    <Icon type="chevron" className="w-6 h-6" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openSection === 'activities' && activities.length > 0 && (
                    <motion.ul
                      key="activities-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {activities.map((item, i) => (
                        <motion.li key={`act-${i}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                          <Link href={item.href} onClick={() => setIsOpen(false)} className={subLinkStyle}>{item.title}</Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <Link href="#vehicles" onClick={() => setIsOpen(false)} className={menuLinkStyle}>Rentals</Link>
                <Link href="#gallery" onClick={() => setIsOpen(false)} className={menuLinkStyle}>Gallery</Link>
                <Link href="#contact" onClick={() => setIsOpen(false)} className={menuLinkStyle}>Contact Us</Link>
              </nav>

              {/* Dynamic Footer Section */}
              <div className="mt-auto pt-12">
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[#EF476F] text-[10px] uppercase tracking-[0.4em] font-black mb-4">Inquiries</p>
                  
                  {ownerData?.email ? (
                    <a 
                      href={`mailto:${ownerData.email}`} 
                      className="text-white text-xl font-medium block mb-8 hover:text-[#EF476F] transition-colors break-all"
                    >
                      {ownerData.email}
                    </a>
                  ) : (
                    // Optional placeholder or subtle loading pulse
                    <div className="h-7 w-48 bg-white/5 animate-pulse rounded mb-8" />
                  )}

                  <div className="flex flex-wrap gap-3">
                    {ownerData?.whatsapp && (
                      <a href={`https://wa.me/${ownerData.whatsapp.replace(/\D/g,'')}`} target="_blank" className={socialIconStyle}>
                        <MessageCircle size={20} />
                      </a>
                    )}
                    
                    {ownerData?.insta_address && (
                      <a href={ownerData.insta_address} target="_blank" className={socialIconStyle}>
                        <Instagram size={20} />
                      </a>
                    )}

                    {ownerData?.fb_address && (
                      <a href={ownerData.fb_address} target="_blank" className={socialIconStyle}>
                        <Facebook size={20} />
                      </a>
                    )}

                    {ownerData?.twitter_address && (
                      <a href={ownerData.twitter_address} target="_blank" className={socialIconStyle}>
                        <Twitter size={20} />
                      </a>
                    )}

                    {ownerData?.linkedin_address && (
                      <a href={ownerData.linkedin_address} target="_blank" className={socialIconStyle}>
                        <Linkedin size={20} />
                      </a>
                    )}

                    {ownerData?.map_embedded_link && (
                      <a 
                        href={ownerData.map_embedded_link} 
                        target="_blank" 
                        className="p-3 bg-[#EF476F]/10 rounded-xl text-[#EF476F] hover:bg-[#EF476F] hover:text-white transition-all flex items-center justify-center"
                      >
                        <MapPin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin
} from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';

// Define only what we need for the footer
interface OwnerInfo {
  office_phone: string;
  email: string;
  office_address: string;
  fb_address: string;
  insta_address: string;
  linkedin_address: string;
  twitter_address: string;
}

const footerLinks = {
  explore: [
    { name: 'About Us', href: '#hero' },
    { name: 'Our Fleet', href: '#vehicles' },
    { name: 'Activities', href: '#activities' },
    { name: 'Packages', href: '#packages' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Rental Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  const [data, setData] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const query = `
        query GetFooterFields {
          ownerInfo {
            office_phone
            email
            office_address
            fb_address
            insta_address
            linkedin_address
            twitter_address
          }
        }
      `;

      try {
        const result = await graphqlClient.request<{ ownerInfo: OwnerInfo }>(query);
        
        if (result?.ownerInfo) {
          setData(result.ownerInfo);
        }
      } catch (err: any) {
        console.error("Footer data fetch error:", err);
        setError('Failed to load contact info');
        // Optional: you can use handleGraphQLError(err) here if you import it
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Map social links dynamically based on fetched data
  const socialLinks = data ? [
    { icon: <Facebook size={18} />, href: data.fb_address },
    { icon: <Instagram size={18} />, href: data.insta_address },
    { icon: <Twitter size={18} />, href: data.twitter_address },
    { icon: <Linkedin size={18} />, href: data.linkedin_address },
  ].filter(link => link.href && link.href.trim() !== '' && link.href !== '#') : [];

  return (
    <footer className="bg-[#00251b] text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter block">
              <img 
              src="/images/logo-dark.png" 
              alt="VacayLanka" 
              className="w-auto h-16 object-contain" 
            />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Crafting unforgettable journeys across Sri Lanka. From misty mountains to golden shores, adventure starts here.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00783e]">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00783e]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00783e]">Get In Touch</h4>
            
            {loading && <p className="text-white/50 text-sm">Loading contact info...</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {!loading && !error && (
              <div className="space-y-4">
                {data?.office_phone && (
                  <a href={`tel:${data.office_phone}`} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
                    <Phone size={16} className="text-white/50 group-hover:text-white/50 shrink-0" />
                    <span className="text-sm font-bold">{data.office_phone}</span>
                  </a>
                )}
                {data?.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
                    <Mail size={16} className="text-white/50 group-hover:text-white/50 shrink-0" />
                    <span className="text-sm font-bold break-all">{data.email}</span>
                  </a>
                )}
                {data?.office_address && (
                  <div className="flex items-start gap-3 text-white/50">
                    <MapPin size={16} className="text-white/50 shrink-0 mt-1" />
                    <span className="text-sm">{data.office_address}</span>
                  </div>
                )}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex gap-5 pt-6">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white/50 transition-all duration-300 transform hover:scale-110"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} VacayLanka (PVT) LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-white/50 text-xs font-medium">
            <span>Developed By</span>
            <a href="https://codebug.lk" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:underline">CODEBUG</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
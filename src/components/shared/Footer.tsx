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

// Define only what we need for the footer
interface FooterData {
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
  const [data, setData] = useState<FooterData | null>(null);

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
        const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const result = await response.json();
        if (result.data?.ownerInfo) {
          setData(result.data.ownerInfo);
        }
      } catch (error) {
        console.error("Footer data fetch error:", error);
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
  ].filter(link => link.href && link.href !== '#') : [];

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter block">
              VACAY<span className="text-[#EF476F]">LANKA</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Crafting unforgettable journeys across Sri Lanka. From misty mountains to golden shores, adventure starts here.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#EF476F]">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#EF476F]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social (DYNAMIC) */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#EF476F]">Get In Touch</h4>
            <div className="space-y-4">
              {data?.office_phone && (
                <a href={`tel:${data.office_phone}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <Phone size={16} className="text-slate-500 group-hover:text-[#EF476F] shrink-0" />
                  <span className="text-sm font-bold">{data.office_phone}</span>
                </a>
              )}
              {data?.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <Mail size={16} className="text-slate-500 group-hover:text-[#EF476F] shrink-0" />
                  <span className="text-sm font-bold break-all">{data.email}</span>
                </a>
              )}
              {data?.office_address && (
                <div className="flex items-start gap-3 text-slate-400">
                  <MapPin size={16} className="text-slate-500 shrink-0 mt-1" />
                  <span className="text-sm">{data.office_address}</span>
                </div>
              )}
            </div>

            <div className="flex gap-5 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#EF476F] transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} VacayLanka (PVT) LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <span>Developed By</span>
            <a href="https://codebug.lk" target="_blank" rel="noopener noreferrer" className="text-[#EF476F] hover:underline">CODEBUG</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Waves, 
  Mountain, 
  Wind, 
  Fish, 
  Eye, 
  Ship 
} from 'lucide-react';
import { request } from 'graphql-request';
import { useLoading } from '@/context/LoadingContext';
import { getProxiedImageUrl } from '@/lib/image-proxy';

const GET_ACTIVITIES = `
  query GetActivities {
    activities (where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
        activityDetails {
          description
          icon
          cardColor
        }
      }
    }
  }
`;

const ICON_MAP: { [key: string]: React.ReactNode } = {
  mountain: <Mountain className="w-6 h-6" />,
  fish: <Fish className="w-6 h-6" />,
  wind: <Wind className="w-6 h-6" />,
  ship: <Ship className="w-6 h-6" />,
  eye: <Eye className="w-6 h-6" />,
  waves: <Waves className="w-6 h-6" />,
};

// Map potential CMS values to static Tailwind classes so they aren't purged
const COLOR_MAP: { [key: string]: string } = {
  'bg-orange-600': 'bg-orange-600',
  'bg-pink-600': 'bg-pink-600',
  'bg-indigo-600': 'bg-indigo-600',
  'bg-cyan-600': 'bg-cyan-600',
  'bg-blue-600': 'bg-blue-600',
  'bg-emerald-600': 'bg-emerald-600',
  'bg-rose-600': 'bg-rose-600',
  'bg-amber-600': 'bg-amber-600',
};

const getProxyEndpoint = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api/graphql/proxy';
  }
  return '/api/graphql/proxy';
};

export default function ActivitiesGrid() {
  const [activities, setActivities] = useState<any[]>([]);
  const { startLoading, finishLoading } = useLoading();

  useEffect(() => {
    async function fetchActivities() {
      try {
        startLoading();
        const proxyUrl = getProxyEndpoint();
        const res: any = await request(proxyUrl, GET_ACTIVITIES);
        setActivities(res.activities?.nodes || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        finishLoading();
      }
    }
    fetchActivities();
    // FIX: Leave dependency array empty to avoid the "size changed" error
  }, []); 

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#EF476F] font-bold tracking-[0.3em] uppercase text-sm block"
        >
          Adventure Awaits
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter"
        >
          Push Your <span className="text-slate-400">Limits</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((act, index) => {
          const details = act.activityDetails;
          if (!details) return null;

          const iconKey = Array.isArray(details.icon) ? details.icon[0] : details.icon;
          const rawColor = Array.isArray(details.cardColor) ? details.cardColor[0] : details.cardColor;
          
          // FIX: Use the COLOR_MAP to ensure Tailwind includes the class in the bundle
          const bgClassName = COLOR_MAP[rawColor] || 'bg-slate-500';

          return (
            <motion.div
              key={act.title + index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1], 
                delay: (index % 3) * 0.1 
              }}
              whileHover={{ y: -10 }}
              className="group relative h-[350px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg bg-white"
            >
              {/* Background Image */}
              <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
                <Image 
                  src={getProxiedImageUrl(act.featuredImage?.node?.sourceUrl || '')}
                  alt={act.title}
                  fill 
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={`${bgClassName} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6`}
                >
                  {ICON_MAP[iconKey] || <Mountain className="w-6 h-6" />}
                </motion.div>

                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                  {act.title}
                </h3>
                
                <p className="text-white/70 font-medium leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 line-clamp-3">
                  {details.description}
                </p>

                <div className="w-12 h-1 bg-white/30 rounded-full mt-6 group-hover:w-full group-hover:bg-[#EF476F] transition-all duration-500" />
              </div>

              <div className="absolute inset-0 border-[1px] border-white/20 rounded-[2.5rem] pointer-events-none z-20" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
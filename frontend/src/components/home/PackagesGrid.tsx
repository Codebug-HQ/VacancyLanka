'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Map, Mountain, Palmtree,
  Binoculars, Heart, Clock, CheckCircle2,
  ChevronRight, Info, Tag, Globe, Camera, Tent, Sunset,
} from 'lucide-react';
import { request } from 'graphql-request';
import Image from 'next/image';
import BookWidget from '../ui/BookWidget';
import { useLoading } from '@/context/LoadingContext';
import { getProxiedImageUrl } from '@/lib/image-proxy';

// Icon Map
const ICON_MAP: { [key: string]: React.ReactNode } = {
  compass: <Compass className="w-6 h-6" />,
  map: <Map className="w-6 h-6" />,
  mountain: <Mountain className="w-6 h-6" />,
  palmtree: <Palmtree className="w-6 h-6" />,
  binoculars: <Binoculars className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  camera: <Camera className="w-6 h-6" />,
  tent: <Tent className="w-6 h-6" />,
  sunset: <Sunset className="w-6 h-6" />,
};

const GET_PACKAGES = `
query GetPackagesAsc {
  packages(
    where: {
      orderby: { field: DATE, order: ASC }
    }
  ) {
    nodes {
      title
      date
      packageDetails {
        desc
        packageIcon
        packageColor
        price
        image {
          node {
            sourceUrl
          }
        }
      }
    }
  }
}
`;

const GET_ITINERARIES = `
query GetItinerariesDesc {
  itineraries(
    where: {
      orderby: { field: DATE, order: ASC }
    }
  ) {
    nodes {
      title
      date
      itineraryDetails {
        duration
        tag
        price
        description
        daysList
        includesList
        notIncludesList
      }
    }
  }
}
`;

const getProxyEndpoint = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api/graphql/proxy';
  }
  return '/api/graphql/proxy';
};

export default function PackagesGrid() {
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const { startLoading, finishLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        startLoading();
        const proxyUrl = getProxyEndpoint();
        const [packagesRes, itinerariesRes] = await Promise.all([
          request(proxyUrl, GET_PACKAGES),
          request(proxyUrl, GET_ITINERARIES),
        ]);
        setPackages(packagesRes.packages?.nodes || []);
        setItineraries(itinerariesRes.itineraries?.nodes || []);
      } catch (err: any) {
        console.error('GraphQL fetch error:', err);
        setError('Failed to load tour packages. Please try again later.');
      } finally {
        finishLoading();
      }
    }
    fetchData();
  }, []);

  const openBooking = (itinerary: { title: string; price?: string }) => {
    setSelectedItinerary({
      title: itinerary.title,
      price: itinerary.price ? `LKR ${itinerary.price}` : 'Contact Us',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#EF476F] font-bold tracking-[0.3em] uppercase text-sm">
          Curated Journeys
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter">
          Find Your Preferred <span className="text-slate-400">Experience</span>
        </motion.h2>
      </div>

      {/* Packages Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {packages.map((pkg, idx) => {
          const details = pkg.packageDetails;
          if (!details) return null;
          const iconKey = Array.isArray(details.packageIcon) ? details.packageIcon[0] : details.packageIcon;
          const colorClass = Array.isArray(details.packageColor) ? details.packageColor[0] : details.packageColor;

          return (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative h-[320px] sm:h-[400px] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-100"
            >
              <Image
                src={getProxiedImageUrl(details.image?.node?.sourceUrl || '')}
                alt={pkg.title}
                fill
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div
  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg ${colorClass || 'bg-slate-600'}`}
>
  {ICON_MAP[iconKey] || <Compass className="w-6 h-6" />}
</div>
                <h3 className="text-2xl font-black text-white mb-2">{pkg.title}</h3>
                <p className="text-gray-300 text-sm mb-6 line-clamp-2">{details.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="text-white">
                    <p className="text-[10px] uppercase font-bold opacity-60">Starting At</p>
                    <p className="text-xl font-black">{details.price === 'Custom' ? 'Contact' : `LKR ${details.price}`}</p>
                  </div>
                  <button
                    onClick={() => openBooking({ title: pkg.title, price: details.price })}
                    className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#EF476F] hover:text-white transition-all active:scale-95"
                  >
                    Book Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Itineraries */}
      <div className="border-t border-gray-100 pt-20">
        <div className="flex flex-col items-center mb-12">
          <Tag className="text-[#EF476F] w-8 h-8 mb-4" />
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 text-center">Featured Itineraries</h3>
          <p className="text-slate-500 mt-4 text-center max-w-2xl">Expertly crafted routes for a seamless island adventure.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {itineraries.map((it) => (
            <ItineraryCard
              key={it.title}
              title={it.title}
              {...it.itineraryDetails}
              onBook={() => openBooking({ title: it.title, price: it.itineraryDetails.price })}
            />
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedItinerary && (
          <BookWidget
            itinerary={selectedItinerary}
            onClose={() => setSelectedItinerary(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ItineraryCard({ title, duration, tag, price, description, daysList, includesList, notIncludesList, onBook }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col h-full"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex-1">
          <span className="bg-[#EF476F]/10 text-[#EF476F] px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
            {tag || 'Featured'}
          </span>
          <h4 className="text-xl md:text-2xl font-black mt-2 text-slate-900 leading-tight">
            {title}
          </h4>
        </div>
        <div className="flex items-center text-gray-500 text-xs md:text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-xl shrink-0">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 text-[#EF476F]" /> 
          {duration}
        </div>
      </div>

      {/* Description */}
      <div 
        className="text-gray-600 mb-6 md:mb-8 leading-relaxed italic border-l-4 border-[#EF476F]/20 pl-4 prose-sm text-sm md:text-base" 
        dangerouslySetInnerHTML={{ __html: description }} 
      />

      {/* Journey Details */}
      <div className="flex-1 space-y-3 mb-6 md:mb-8">
        <p className="font-bold text-[10px] uppercase text-gray-400 tracking-widest">
          Journey Details
        </p>
        <div 
          className="prose prose-sm prose-slate text-gray-500 text-sm max-w-none prose-li:my-1 prose-ul:pl-4" 
          dangerouslySetInnerHTML={{ __html: daysList }} 
        />
      </div>

      {/* Grid: Stacked on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-5 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem]">
        <div className="space-y-2">
          <p className="text-emerald-600 font-bold text-[10px] uppercase flex items-center tracking-wider">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Included
          </p>
          <div 
            className="prose prose-xs text-gray-500 text-xs md:text-sm prose-li:my-0.5 prose-ul:pl-4" 
            dangerouslySetInnerHTML={{ __html: includesList }} 
          />
        </div>
        
        {/* Divider for mobile only */}
        <div className="block md:hidden h-px bg-gray-200 w-full" />

        <div className="space-y-2">
          <p className="text-gray-400 font-bold text-[10px] uppercase flex items-center tracking-wider">
            <Info className="w-3 h-3 mr-1.5" /> Not Included
          </p>
          <div 
            className="prose prose-xs text-slate-400 text-xs md:text-sm prose-li:my-0.5 prose-ul:pl-4" 
            dangerouslySetInnerHTML={{ __html: notIncludesList }} 
          />
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
        <div className="text-center sm:text-left">
          <span className="text-[10px] md:text-xs text-gray-400 italic">Starting from</span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="text-xs font-bold text-slate-900">LKR</span>
            <span className="text-2xl md:text-3xl font-black text-slate-900">{price || 'Custom'}</span>
          </div>
        </div>
        <button 
          onClick={onBook} 
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-[#EF476F] active:scale-95 transition-all shadow-lg shadow-slate-200"
        >
          Book Trip <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  );
}
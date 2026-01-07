'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { request } from 'graphql-request';
import SriLankaMap from '../ui/SriLankaMap';
import Lightbox from '../shared/Lightbox';
import { useLoading } from '@/context/LoadingContext';
import { s } from 'framer-motion/client';
import { getProxiedImageUrl } from '@/lib/image-proxy';

const GET_DESTINATIONS = `
  query GetDestinations {
    destinations {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
        destinationsDetails {
          districtOrder
          shortDescription
          spot1 {
            title
            description
            image {
              node {
                sourceUrl
              }
            }
          }
          spot2 {
            title
            description
            image {
              node {
                sourceUrl
              }
            }
          }
          spot3 {
            title
            description
            image {
              node {
                sourceUrl
              }
            }
          }
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

interface Spot {
  title: string | null;
  description: string | null;
  image: string | null;
}

interface Destination {
  name: string;
  desc: string;
  image: string;
  places: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  districtOrder: number;
}

export default function DestinationGrid() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const { startLoading, finishLoading } = useLoading();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        startLoading();
        const proxyUrl = getProxyEndpoint();
        const data = await request(proxyUrl, GET_DESTINATIONS);

        const formatted: Destination[] = (data.destinations?.nodes || [])
          .filter((node: any) => node.destinationsDetails?.districtOrder != null) // optional: only include if order set
          .map((node: any) => {
            const details = node.destinationsDetails;

            const places = [];
            if (details.spot1?.title) {
              places.push({
                title: details.spot1.title,
                description: details.spot1.description || '',
                image: details.spot1.image?.node?.sourceUrl || '/placeholder.jpg',
              });
            }
            if (details.spot2?.title) {
              places.push({
                title: details.spot2.title,
                description: details.spot2.description || '',
                image: details.spot2.image?.node?.sourceUrl || '/placeholder.jpg',
              });
            }
            if (details.spot3?.title) {
              places.push({
                title: details.spot3.title,
                description: details.spot3.description || '',
                image: details.spot3.image?.node?.sourceUrl || '/placeholder.jpg',
              });
            }

            return {
              name: node.title,
              desc: details.shortDescription || 'Discover this beautiful destination',
              image: node.featuredImage?.node?.sourceUrl || '/placeholder.jpg',
              places,
              districtOrder: details.districtOrder ?? 999,
            };
          })
          // Sort by districtOrder ASC
          formatted.sort((a, b) => a.districtOrder - b.districtOrder);

        setDestinations(formatted);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        finishLoading();
      }
    }

    fetchDestinations();
  }, []);

  const nextPlace = () => {
    if (!selectedDest) return;
    setCurrentPlaceIndex((prev) => (prev + 1) % selectedDest.places.length);
  };

  const prevPlace = () => {
    if (!selectedDest) return;
    setCurrentPlaceIndex((prev) => (prev - 1 + selectedDest.places.length) % selectedDest.places.length);
  };

  const rows = [];
  for (let i = 0; i < destinations.length; i += 5) {
    rows.push(destinations.slice(i, i + 5));
  }

  return (
    <section className="overflow-hidden bg-[#fafafa]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border-t-4 border-[#EF476F] pt-8 text-center lg:text-left lg:border-t-0 lg:border-l-8 lg:pl-12 lg:pt-0"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              Crafting Unforgettable Journeys in <span className="text-[#EF476F]">Paradise</span>
            </h2>
            <p className="text-md text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              At VacayLanka, we believe travel is more than just visiting places — it’s about creating stories you’ll carry forever. From exploring Sri Lanka’s golden beaches and misty mountains to celebrating love with a dream wedding or a magical surprise proposal, we design every detail with care and passion. Whether it’s a curated holiday package, a luxury vehicle rental, or the perfect hotel stay, we’re here to make your Sri Lankan adventure seamless, personal, and unforgettable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <SriLankaMap hoveredDistrict={hoveredDistrict} onDistrictHover={setHoveredDistrict} />
          </motion.div>
        </div>
      </div>

      {/* Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Accordion */}
        <div className="hidden md:flex md:flex-col gap-6">
          {rows.map((row, rowIndex) => {
            const isRowActive = hoveredIndex !== null && Math.floor(hoveredIndex / 5) === rowIndex;
            const isOtherRowActive = hoveredIndex !== null && !isRowActive;

            return (
              <motion.div
                key={rowIndex}
                animate={{ filter: isOtherRowActive ? 'brightness(0.6)' : 'brightness(1)' }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 h-[350px]"
              >
                {row.map((dest, colIndex) => {
                  const globalIndex = rowIndex * 5 + colIndex;
                  const isHovered = hoveredIndex === globalIndex;
                  const isSiblingHovered = isRowActive && hoveredIndex !== globalIndex;

                  return (
                    <motion.div
                      key={globalIndex}
                      layout
                      onMouseEnter={() => setHoveredIndex(globalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        setSelectedDest(dest);
                        setCurrentPlaceIndex(0);
                      }}
                      transition={{ layout: { type: "spring", stiffness: 150, damping: 25 } }}
                      className="relative overflow-hidden rounded-[2rem] cursor-pointer group shadow-xl"
                      style={{ flex: isHovered ? 4.5 : (isSiblingHovered ? 0.6 : 1) }}
                    >
                      <Image
                        src={getProxiedImageUrl(dest.image)}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized // Important for external/local WP images
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <AnimatePresence>
                          {!isSiblingHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 40 }}
                              transition={{ duration: 0.4 }}
                            >
                              <h3 className={`font-black text-white uppercase tracking-tighter transition-all duration-500 ${isHovered ? 'text-5xl' : 'text-2xl'}`}>
                                {dest.name}
                              </h3>
                              {isHovered && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-gray-200 mt-3 text-lg max-w-sm"
                                >
                                  {dest.desc}
                                </motion.p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-x-auto flex gap-4 -mx-3 px-4 snap-x snap-mandatory scrollbar-hide">
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDest(dest);
                    setCurrentPlaceIndex(0);
                  }}
                  className="snap-start h-[300px] flex-none w-[85vw] max-w-sm relative overflow-hidden rounded-3xl cursor-pointer group shadow-lg"
                >
                  <Image
                    src={getProxiedImageUrl(dest.image)}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-black text-white text-3xl uppercase tracking-tighter">
                      {dest.name}
                    </h3>
                    <p className="text-gray-200 text-sm mt-2 opacity-90">
                      {dest.desc}
                    </p>
                  </div>
                  <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>

            <button
              onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#EF476F]/30 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#EF476F]/30 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        destination={selectedDest}
        onClose={() => setSelectedDest(null)}
        currentPlaceIndex={currentPlaceIndex}
        onNext={nextPlace}
        onPrev={prevPlace}
      />
    </section>
  );
}
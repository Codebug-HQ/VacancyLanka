'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { request } from 'graphql-request';
import SriLankaMap from '../ui/SriLankaMap';
import Lightbox from '../shared/Lightbox';
import { useLoading } from '@/context/LoadingContext';
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

interface Place {
  title: string;
  description: string;
  image: string;
}

interface Destination {
  name: string;
  desc: string;
  image: string;
  places: Place[];
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
        const data: any = await request(proxyUrl, GET_DESTINATIONS);
        
        const formatted: Destination[] = (data.destinations?.nodes || [])
          .map((node: any) => {
            const details = node.destinationsDetails || {};
            // Typed array to prevent the "implicitly has any type" error
            const places: Place[] = [];
            
            // Helper to extract spot data exactly like your other components
            const extractSpot = (spot: any) => {
              if (spot?.title) {
                places.push({
                  title: spot.title,
                  description: spot.description || '',
                  image: getProxiedImageUrl(spot.image?.node?.sourceUrl || ''),
                });
              }
            };

            extractSpot(details.spot1);
            extractSpot(details.spot2);
            extractSpot(details.spot3);

            return {
              name: node.title,
              desc: details.shortDescription || 'Discover this beautiful destination',
              image: getProxiedImageUrl(node.featuredImage?.node?.sourceUrl || ''),
              places,
              districtOrder: details.districtOrder ?? 999,
            };
          })
          .sort((a: Destination, b: Destination) => a.districtOrder - b.districtOrder);

        setDestinations(formatted);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        finishLoading();
      }
    }
    fetchDestinations();
  }, [startLoading, finishLoading]);

  const nextPlace = () => {
    if (!selectedDest) return;
    setCurrentPlaceIndex((prev) => (prev + 1) % selectedDest.places.length);
  };

  const prevPlace = () => {
    if (!selectedDest) return;
    setCurrentPlaceIndex((prev) => (prev - 1 + selectedDest.places.length) % selectedDest.places.length);
  };

  const rows: Destination[][] = [];
  for (let i = 0; i < destinations.length; i += 5) {
    rows.push(destinations.slice(i, i + 5));
  }

  return (
    <section className="overflow-hidden bg-[#fafafa] py-16 md:py-24">
      <div className="max-w-7xl mx-auto mb-12 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:border-l-8 border-[#EF476F] lg:pl-12"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              Crafting Unforgettable Journeys in <span className="text-[#EF476F]">Paradise</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
              At VacayLanka, we believe travel is more than just visiting places — it’s about creating stories you’ll carry forever.
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
                className="flex gap-4 h-[380px]"
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
                      className="relative overflow-hidden rounded-[2.5rem] cursor-pointer group shadow-2xl bg-slate-200"
                      style={{ flex: isHovered ? 5 : (isSiblingHovered ? 0.6 : 1) }}
                    >
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                        priority={globalIndex < 5}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <AnimatePresence>
                          {!isSiblingHovered && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} 
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <h3 className={`font-black text-white uppercase tracking-tighter transition-all duration-500 ${isHovered ? 'text-5xl' : 'text-2xl'}`}>
                                {dest.name}
                              </h3>
                              {isHovered && (
                                <p className="text-gray-200 mt-3 text-lg max-w-md line-clamp-2">
                                  {dest.desc}
                                </p>
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
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
            {destinations.map((dest, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedDest(dest);
                  setCurrentPlaceIndex(0);
                }}
                className="snap-center shrink-0 w-[85vw] h-[450px] relative rounded-[2rem] overflow-hidden shadow-xl"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{dest.name}</h3>
                  <p className="text-white/80 text-sm mt-2 line-clamp-2">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDest && (
        <Lightbox
          destination={selectedDest}
          onClose={() => setSelectedDest(null)}
          currentPlaceIndex={currentPlaceIndex}
          onNext={nextPlace}
          onPrev={prevPlace}
        />
      )}
    </section>
  );
}
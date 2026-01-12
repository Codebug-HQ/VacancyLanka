'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Gauge, Users, Fuel, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { request } from 'graphql-request';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ReserveWidget from '../ui/ReserveWidget';
import { useLoading } from '@/context/LoadingContext';
import { getProxiedImageUrl } from '@/lib/image-proxy';

const GET_VEHICLES = `
  query GetVehicles {
    vehicles(where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        featuredImage {
          node { sourceUrl }
        }
        vehicleDetails {
          pricePerDay
          dailyKmLimit
          passengers
          fuelType
          requiredDocuments
          image1 { node { sourceUrl } }
          image2 { node { sourceUrl } }
          image3 { node { sourceUrl } }
          image4 { node { sourceUrl } }
          image5 { node { sourceUrl } }
        }
      }
    }
  }
`;

interface VehicleImage {
  node?: { sourceUrl?: string };
}

interface Vehicle {
  title: string;
  featuredImage?: VehicleImage;
  vehicleDetails: {
    pricePerDay: number;
    dailyKmLimit: string;
    passengers: number;
    fuelType: string[];
    requiredDocuments: string;
    image1?: VehicleImage;
    image2?: VehicleImage;
    image3?: VehicleImage;
    image4?: VehicleImage;
    image5?: VehicleImage;
  };
}

export default function VehiclesSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { startLoading, finishLoading } = useLoading();

  useEffect(() => {
    async function fetchVehicles() {
      try {
        startLoading();
        const res = await request(window.location.origin + '/api/graphql/proxy', GET_VEHICLES);
        setVehicles(res.vehicles?.nodes || []);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        finishLoading();
      }
    }
    fetchVehicles();
  }, [startLoading, finishLoading]);

  // Helper: Clean fuel type text
  const cleanFuelType = (fuelArray: string[]) => {
    if (!fuelArray || fuelArray.length === 0) return 'N/A';
    return fuelArray[0].replace(/^Choices:\s*/, '').trim();
  };

  // Helper: Transform HTML string into a clean array for badges
  const cleanDocumentsArray = (html: string) => {
    if (!html) return [];
    return html
      .replace(/<[^>]*>?/gm, '|') // Replace tags with separator
      .split('|')
      .map(item => item.trim())
      .filter(item => item.length > 1 && item !== '•');
  };

  // Helper: Gather all valid images (Featured first, then 1-5)
  const getAllImages = (car: Vehicle) => {
    const images = [];
    if (car.featuredImage?.node?.sourceUrl) images.push(car.featuredImage.node.sourceUrl);
    for (let i = 1; i <= 5; i++) {
      const img = (car.vehicleDetails as any)[`image${i}`]?.node?.sourceUrl;
      if (img) images.push(img);
    }
    return images;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Global Swiper Overrides for Green Theme */}
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #00783e !important;
          width: 20px !important;
          border-radius: 5px !important;
        }
        .swiper-pagination-bullet {
          background: #00783e;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .swiper-pagination-lock { display: none !important; }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#00783e] font-bold tracking-[0.3em] uppercase text-xs mb-2 block"
        >
          Premium Fleet
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-[#00251b] tracking-tighter"
        >
          Explore In <span className="text-[#00783e]">Style</span>
        </motion.h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((car) => {
          const carImages = getAllImages(car);
          const safeId = car.title.replace(/[^a-zA-Z0-9]/g, '');
          const docs = cleanDocumentsArray(car.vehicleDetails.requiredDocuments);

          return (
            <motion.div
              key={car.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full"
            >
              {/* Slider Section */}
<div className="relative h-64 md:h-72 group/slider overflow-hidden rounded-t-[2.5rem] isolate">
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    // Navigation IDs
    navigation={{
      nextEl: `.next-${safeId}`,
      prevEl: `.prev-${safeId}`,
    }}
    // Pagination & Behavior
    pagination={{ 
      clickable: true, 
      dynamicBullets: true 
    }}
    autoplay={{ 
      delay: 5000, 
      disableOnInteraction: true 
    }}
    // Critical Fixes
    spaceBetween={0} 
    slidesPerView={1}
    centeredSlides={true}
    watchSlidesProgress={true}
    className="h-full w-full overflow-hidden"
  >
    {carImages.map((src, idx) => (
      <SwiperSlide key={idx} className="overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={getProxiedImageUrl(src)}
            alt={`${car.title} - ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
            priority={idx === 0}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Navigation Arrows - Using higher z-index */}
  <button className={`next-${safeId} absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white hover:text-[#00783e] active:scale-90 shadow-lg`}>
    <ChevronRight size={20} />
  </button>
  <button className={`prev-${safeId} absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white hover:text-[#00783e] active:scale-90 shadow-lg`}>
    <ChevronLeft size={20} />
  </button>

  {/* Price Label - Moved to z-30 */}
  <div className="absolute top-5 right-5 z-30 bg-[#00251b]/95 backdrop-blur-md text-white px-5 py-2 rounded-2xl border border-white/10 shadow-2xl pointer-events-none">
    <span className="text-[10px] uppercase tracking-widest text-[#00ea78] block font-black mb-0.5">Daily</span>
    <p className="text-xl font-black leading-none">USD {car.vehicleDetails.pricePerDay}</p>
  </div>
</div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-[#00251b] mb-6 line-clamp-1 group-hover:text-[#00783e] transition-colors">
                  {car.title}
                </h3>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <SpecBox 
                    icon={<Gauge size={16} />} 
                    label={car.vehicleDetails.dailyKmLimit} 
                    unit={car.vehicleDetails.dailyKmLimit?.toLowerCase() === 'unlimited' ? '' : ' km'} 
                  />
                  <SpecBox icon={<Users size={16} />} label={`${car.vehicleDetails.passengers} Seats`} />
                  <SpecBox icon={<Fuel size={16} />} label={cleanFuelType(car.vehicleDetails.fuelType)} />
                </div>

                {/* Documents / Requirements */}
                <div className="mb-8 flex-grow">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#00783e] font-extrabold mb-4">
                    Requirement Check
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {docs.length > 0 ? (
                      docs.map((doc, index) => (
                        <span 
                          key={index}
                          className="text-[11px] font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2 group-hover:border-[#00783e]/20 transition-colors"
                        >
                          <div className="w-1 h-1 rounded-full bg-[#00783e]" />
                          {doc}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">No specific documents required</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setSelectedVehicle(car)}
                  className="w-full group/btn relative overflow-hidden bg-[#00251b] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Reserve Now
                    <Calendar size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-[#00783e] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedVehicle && (
        <ReserveWidget
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          cleanFuelType={cleanFuelType}
        />
      )}
    </div>
  );
}

// Helper Sub-component
function SpecBox({ icon, label, unit = "" }: { icon: React.ReactNode; label: string; unit?: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 transition-all hover:bg-white hover:border-[#00783e]/30">
      <div className="text-[#00783e] mb-0.5">{icon}</div>
      <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
        {label}{unit}
      </span>
    </div>
  );
}
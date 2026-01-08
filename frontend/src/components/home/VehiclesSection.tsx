'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Car, Gauge, Users, Fuel, Calendar } from 'lucide-react';
import { request } from 'graphql-request';
import ReserveWidget from '../ui/ReserveWidget';
import { useLoading } from '@/context/LoadingContext';
import { s } from 'framer-motion/client';
import { getProxiedImageUrl } from '@/lib/image-proxy';

const GET_VEHICLES = `
  query GetVehicles {
    vehicles (
      where: {orderby: {field: DATE, order: ASC}}
    )
    {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
        vehicleDetails {
          pricePerDay
          dailyKmLimit
          passengers
          fuelType
          requiredDocuments
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

interface Vehicle {
  title: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  vehicleDetails: {
    pricePerDay: number;
    dailyKmLimit: string;
    passengers: number;
    fuelType: string[];
    requiredDocuments: string;
  };
}

export default function VehiclesSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { startLoading, finishLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        startLoading();
        const proxyUrl = getProxyEndpoint();
        const res = await request(proxyUrl, GET_VEHICLES);
        setVehicles(res.vehicles?.nodes || []);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        finishLoading();
      }
    }
    fetchVehicles();
  }, []);

  // Helper: Clean fuel type
  const cleanFuelType = (fuelArray: string[]) => {
    if (!fuelArray || fuelArray.length === 0) return 'N/A';
    const value = fuelArray[0];
    return value.replace(/^Choices:\s*/, '').trim();
  };

  // Helper: Clean documents HTML
  const cleanDocumentsHTML = (html: string) => {
    if (!html) return '<p>No documents specified.</p>';
    return html
      .replace(/class="[^"]*text-\[10px\][^"]*"/g, '')
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#EF476F] font-bold tracking-[0.3em] uppercase text-sm"
        >
          Premium Fleet
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter"
        >
          Explore In <span className="text-slate-400">Style</span>
        </motion.h2>
      </div>

{ /* Vehicles Grid Wrapper */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 px-4 md:px-0">
  {vehicles.map((car) => (
    <motion.div
      key={car.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={getProxiedImageUrl(car.featuredImage?.node?.sourceUrl || '')}
          alt={car.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized
        />
        
        {/* Price Tag - Modern Floating Style */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg border border-white/10">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] uppercase tracking-tighter text-slate-400 mb-1 font-bold">Daily</span>
            <p className="text-lg font-black">
              LKR {car.vehicleDetails.pricePerDay}
            </p>
          </div>
        </div>

        {/* Subtle Gradient bottom-up for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
        {/* Title & Badge */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#EF476F] transition-colors duration-300">
            {car.title}
          </h3>
        </div>

        {/* Specs - Visual Icon Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
          <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 group-hover:bg-white group-hover:border-[#EF476F]/20 transition-all">
            <Gauge className="w-4 h-4 text-[#EF476F]" />
<span className="text-[11px] font-bold text-slate-700">
  {car.vehicleDetails.dailyKmLimit}{!isNaN(Number(car.vehicleDetails.dailyKmLimit)) ? ' km' : ''}
</span>          
</div>
          <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 group-hover:bg-white group-hover:border-[#EF476F]/20 transition-all">
            <Users className="w-4 h-4 text-[#EF476F]" />
            <span className="text-[11px] font-bold text-slate-700">{car.vehicleDetails.passengers} Seats</span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 group-hover:bg-white group-hover:border-[#EF476F]/20 transition-all">
            <Fuel className="w-4 h-4 text-[#EF476F]" />
            <span className="text-[11px] font-bold text-slate-700">{cleanFuelType(car.vehicleDetails.fuelType)}</span>
          </div>
        </div>

        {/* Documents Section with subtle styling */}
        <div className="mb-8 px-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-extrabold mb-4">
            Requirement Check
          </p>
          <div
            className="text-[13px] leading-relaxed text-slate-500 prose-sm list-none space-y-2 opacity-80"
            dangerouslySetInnerHTML={{
              __html: cleanDocumentsHTML(car.vehicleDetails.requiredDocuments),
            }}
          />
        </div>

        {/* Button - Modern Large CTA */}
        <button
          onClick={() => setSelectedVehicle(car)}
          className="mt-auto w-full relative overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
        >
          <span className="relative z-10 flex items-center gap-2">
            Reserve Vehicle
            <Calendar className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
          {/* Hover Effect Layer */}
          <div className="absolute inset-0 bg-[#EF476F] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </motion.div>
  ))}
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
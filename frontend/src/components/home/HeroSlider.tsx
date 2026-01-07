'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { request } from 'graphql-request';
import { getProxiedImageUrl } from '@/app/api/image-proxy/utils';
import { useLoading } from '@/context/LoadingContext';

// Styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GET_SLIDERS = `
query HeroSliders {
  sliders {
    nodes {
      title
      featuredImage {
        node {
          sourceUrl
        }
      }
      sliderDetails {
        tag
        shortDescription
        order
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

interface SliderNode {
  title: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  } | null;
  sliderDetails: {
    tag: string;
    shortDescription: string;
    order: number;
  };
}

export default function InteractiveHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<
    Array<{
      title: string;
      location: string;
      description: string;
      image: string;
    }>
  >([]);
  const { startLoading, finishLoading } = useLoading();

  useEffect(() => {
    async function fetchSliders() {
      startLoading();
      try {
        const proxyUrl = getProxyEndpoint();
        const data = await request<{ sliders: { nodes: SliderNode[] } }>(proxyUrl, GET_SLIDERS);

        const sortedSlides = data.sliders.nodes
          .filter((node): node is SliderNode & { featuredImage: NonNullable<SliderNode['featuredImage']> } =>
            Boolean(node.featuredImage?.node?.sourceUrl)
          )
          .sort((a, b) => a.sliderDetails.order - b.sliderDetails.order)
          .map((node) => ({
            title: node.title,
            location: node.sliderDetails.tag,
            description: node.sliderDetails.shortDescription,
            image: getProxiedImageUrl(node.featuredImage.node.sourceUrl),
          }));

        setSlides(sortedSlides);
      } catch (err) {
        console.error('Failed to load hero slides:', err);
        // Optional: fallback to empty or placeholder slides
      } finally {
        finishLoading();
      }
    }

    fetchSliders();
  }, [startLoading, finishLoading]);

  if (slides.length === 0) {
    return null; // Global loader will show via LoadingProvider
  }

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            {/* Background Image with Zoom Effect */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={activeIndex === index ? { scale: 1 } : { scale: 1.1 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 lg:px-32">
              <div className="max-w-4xl">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={activeIndex === index ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="inline-block py-1 px-4 mb-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm tracking-widest uppercase font-medium"
                >
                  {slide.location}
                </motion.span>

                <div className="overflow-hidden mb-4">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={activeIndex === index ? { y: 0 } : { y: "100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-none uppercase tracking-tighter"
                  >
                    {slide.title}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={activeIndex === index ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-lg md:text-xl text-zinc-200 max-w-xl mb-10 leading-relaxed drop-shadow-lg"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={activeIndex === index ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1, type: "spring" }}
                  className="flex gap-4"
                >
                  <a
                    href="/#packages"
                    className="cursor-pointer group relative px-8 py-4 bg-white text-black font-bold rounded-sm overflow-hidden transition-all hover:bg-[#0f172b] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0f172b]"
                  >
                    <span className="relative z-10">BOOK EXPERIENCE</span>
                  </a>
                  <a
                    href="/#gallery"
                    className="cursor-pointer px-8 py-4 border border-white/50 text-white font-bold rounded-sm hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    VIEW GALLERY
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Side Progress Indicators (Desktop) */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 z-20">
              {slides.map((_, dotIndex) => (
                <div key={dotIndex} className="relative flex items-center justify-center">
                  <div
                    className={`w-1 h-12 rounded-full transition-all duration-500 ${
                      activeIndex === dotIndex ? 'bg-white h-16' : 'bg-white/20'
                    }`}
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modern Glass Bottom Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 px-8 py-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full">
        <span className="text-white/50 font-mono text-sm">0{activeIndex + 1}</span>
        <div className="w-24 h-[1px] bg-white/20 overflow-hidden relative">
          <motion.div
            key={activeIndex}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0 bg-white"
          />
        </div>
        <span className="text-white/50 font-mono text-sm">0{slides.length}</span>
      </div>
    </section>
  );
}
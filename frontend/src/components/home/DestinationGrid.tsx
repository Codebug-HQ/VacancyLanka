import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Safe proxy function - prevents double-proxying
function getProxiedImageUrl(url) {
  if (!url) return '/api/placeholder/800/600';
  if (url.includes('/api/image-proxy?url=')) return url;
  if (
    url.includes('vacaylanka.atwebpages.com') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.startsWith('http')
  ) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// Lightbox Component
function Lightbox({ destination, onClose, currentPlaceIndex, onNext, onPrev }) {
  if (!destination) return null;

  const currentPlace = destination.places[currentPlaceIndex];
  const hasMultiplePlaces = destination.places.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation arrows - only show if multiple places */}
      {hasMultiplePlaces && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-6 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-6 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Image */}
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
            <img
              src={currentPlace?.image || '/api/placeholder/800/600'}
              alt={currentPlace?.title || 'Place'}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', currentPlace?.image);
                e.target.src = '/api/placeholder/800/600';
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                {currentPlace?.title || 'Untitled'}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 md:p-12">
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentPlace?.description || 'No description available.'}
            </p>

            {/* Place counter */}
            {hasMultiplePlaces && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {destination.places.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentPlaceIndex
                        ? 'w-8 bg-[#00783e]'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Destination name tag */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                {destination.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock destinations data for demo
const mockDestinations = [
  {
    name: 'Colombo',
    desc: 'The vibrant capital city blending colonial charm with modern elegance',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    districtOrder: 1,
    places: [
      {
        title: 'Galle Face Green',
        description: 'A popular ocean-side urban park stretching for half a kilometer along the coast. Perfect for evening strolls and street food.',
        image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800'
      },
      {
        title: 'Gangaramaya Temple',
        description: 'One of the most important temples in Colombo, featuring a mix of architectural styles and a museum with Buddhist artifacts.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
      },
      {
        title: 'Pettah Market',
        description: 'A bustling marketplace offering everything from spices to electronics. Experience the authentic local shopping culture.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
      }
    ]
  },
  {
    name: 'Kandy',
    desc: 'Sacred city nestled in the hills, home to the Temple of the Tooth',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800',
    districtOrder: 2,
    places: [
      {
        title: 'Temple of the Tooth',
        description: 'Sacred Buddhist temple housing a relic of the tooth of Buddha. A UNESCO World Heritage site and pilgrimage destination.',
        image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800'
      },
      {
        title: 'Kandy Lake',
        description: 'An artificial lake in the heart of the city, created in 1807. Perfect for peaceful walks with stunning views.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      }
    ]
  },
  {
    name: 'Galle',
    desc: 'Historic port city with a stunning Dutch colonial fort',
    image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800',
    districtOrder: 3,
    places: [
      {
        title: 'Galle Fort',
        description: 'A UNESCO World Heritage site, this 17th-century Dutch fort is one of the best-preserved colonial fortifications in Asia.',
        image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800'
      }
    ]
  },
  {
    name: 'Ella',
    desc: 'Mountain paradise with tea plantations and breathtaking vistas',
    image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800',
    districtOrder: 4,
    places: [
      {
        title: 'Nine Arch Bridge',
        description: 'An iconic railway bridge built entirely of stone and cement, without any steel. A masterpiece of colonial engineering.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800'
      },
      {
        title: 'Little Adam\'s Peak',
        description: 'A relatively easy hike with spectacular panoramic views of the Ella Gap and surrounding tea plantations.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      }
    ]
  },
  {
    name: 'Sigiriya',
    desc: 'Ancient rock fortress rising dramatically from the plains',
    image: 'https://images.unsplash.com/photo-1579009934631-e71aef3a6921?w=800',
    districtOrder: 5,
    places: [
      {
        title: 'Sigiriya Rock',
        description: 'An ancient rock fortress with stunning frescoes and gardens. UNESCO World Heritage site and one of Sri Lanka\'s most iconic landmarks.',
        image: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=800'
      }
    ]
  }
];

export default function DestinationGrid() {
  const [destinations] = useState(mockDestinations);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  const nextPlace = () => {
    if (!selectedDest?.places?.length) return;
    setCurrentPlaceIndex((prev) => (prev + 1) % selectedDest.places.length);
  };

  const prevPlace = () => {
    if (!selectedDest?.places?.length) return;
    setCurrentPlaceIndex((prev) => (prev - 1 + selectedDest.places.length) % selectedDest.places.length);
  };

  // Split into rows of 5 for desktop grid
  const rows = [];
  for (let i = 0; i < destinations.length; i += 5) {
    rows.push(destinations.slice(i, i + 5));
  }

  return (
    <section className="overflow-hidden bg-[#fafafa] min-h-screen py-12">
      {/* Hero section */}
      <div className="max-w-7xl mx-auto mb-12 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="lg:border-l-8 border-[#00783e] lg:pl-12">
            <h2 className="text-4xl md:text-6xl font-black text-[#00251b] mb-8 tracking-tighter leading-[0.9]">
              Crafting Unforgettable Journeys in <span className="text-[#00783e]">Paradise</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
              At VacayLanka, we believe travel is more than just visiting places — it's about creating stories you'll carry forever.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop - Accordion style grid */}
        <div className="hidden md:flex md:flex-col gap-6">
          {rows.map((row, rowIndex) => {
            const isRowActive = hoveredIndex !== null && Math.floor(hoveredIndex / 5) === rowIndex;
            const isOtherRowActive = hoveredIndex !== null && !isRowActive;

            return (
              <div
                key={rowIndex}
                style={{ filter: isOtherRowActive ? 'brightness(0.6)' : 'brightness(1)', transition: 'filter 0.4s' }}
                className="flex gap-4 h-[380px]"
              >
                {row.map((dest, colIndex) => {
                  const globalIndex = rowIndex * 5 + colIndex;
                  const isHovered = hoveredIndex === globalIndex;
                  const isSiblingHovered = isRowActive && hoveredIndex !== globalIndex;

                  return (
                    <div
                      key={globalIndex}
                      onMouseEnter={() => setHoveredIndex(globalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        setSelectedDest(dest);
                        setCurrentPlaceIndex(0);
                      }}
                      className="relative overflow-hidden rounded-[2.5rem] cursor-pointer group shadow-2xl bg-slate-200 transition-all duration-500"
                      style={{ flex: isHovered ? 5 : isSiblingHovered ? 0.6 : 1 }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => e.target.src = '/api/placeholder/800/600'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div
                          style={{
                            opacity: isSiblingHovered ? 0 : 1,
                            transition: 'opacity 0.4s'
                          }}
                        >
                          <h3
                            className="font-black text-white uppercase tracking-tighter transition-all duration-500"
                            style={{ fontSize: isHovered ? '3rem' : '1.5rem' }}
                          >
                            {dest.name}
                          </h3>
                          {isHovered && (
                            <p className="text-gray-200 mt-3 text-lg max-w-md line-clamp-2">
                              {dest.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mobile - Horizontal carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory">
            {destinations.map((dest, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedDest(dest);
                  setCurrentPlaceIndex(0);
                }}
                className="snap-center shrink-0 w-[85vw] h-[450px] relative rounded-[2rem] overflow-hidden shadow-xl"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => e.target.src = '/api/placeholder/800/600'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-white font-black text-3xl uppercase tracking-tighter">
                    {dest.name}
                  </h3>
                  <p className="text-white/80 text-sm mt-2 line-clamp-2">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal */}
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
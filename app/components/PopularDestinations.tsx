import React, { useRef, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const destinationsByRegion: Record<string, { name: string; image: string }[]> = {
  europe: [
    { name: 'Paris', image: '/popdest/paris.jpg' },
    { name: 'London', image: '/popdest/london.jpg' },
    { name: 'Rome', image: '/popdest/rome.webp' },
    { name: 'Barcelona', image: '/popdest/barcelona.jpg' },
    { name: 'Istanbul', image: '/popdest/istanbul.webp' },
  ],
  usa: [
    { name: 'New York', image: '/popdest/newyork.webp' },
    { name: 'Los Angeles', image: '/popdest/losangeles.jpg' },
    { name: 'Miami', image: '/popdest/miami.jpg' },
    { name: 'Chicago', image: '/popdest/chicago.jpg' },
    { name: 'San Francisco', image: '/popdest/sanfrancisco.jpg' },
  ],
  australia: [
    { name: 'Sydney', image: '/popdest/sydney.webp' },
    { name: 'Melbourne', image: '/popdest/melbourne.jpg' },
    { name: 'Brisbane', image: '/popdest/brisbane.jpg' },
    { name: 'Perth', image: '/popdest/perth.jpg' },
    { name: 'Adelaide', image: '/popdest/adelaide.jpg' },
  ],
  'far east': [
    { name: 'Tokyo', image: '/popdest/tokyo.webp' },
    { name: 'Bangkok', image: '/popdest/bangkok.jpg' },
    { name: 'Singapore', image: '/popdest/singapore.webp' },
    { name: 'Hong Kong', image: '/popdest/hongkong.jpg' },
    { name: 'Seoul', image: '/popdest/seoul.jpg' },
  ],
  africa: [
    { name: 'Cape Town', image: '/popdest/capetown.webp' },
    { name: 'Johannesburg', image: '/popdest/johannesburg.jpg' },
    { name: 'Marrakech', image: '/popdest/marrakech.jpg' },
    { name: 'Cairo', image: '/popdest/cairo.jpg' },
    { name: 'Nairobi', image: '/popdest/nairobi.jpg' },
  ],
  'middle east': [
    { name: 'Dubai', image: '/popdest/dubai.jpg' },
    { name: 'Abu Dhabi', image: '/popdest/abudhabi.jpg' },
    { name: 'Doha', image: '/popdest/doha.jpg' },
    { name: 'Riyadh', image: '/popdest/riyadh.jpg' },
    { name: 'Muscat', image: '/popdest/muscat.jpg' },
  ],
};

const tabs = [
  { key: 'europe', label: 'Europe' },
  { key: 'usa', label: 'USA' },
  { key: 'australia', label: 'Australia' },
  { key: 'far east', label: 'Far East' },
  { key: 'africa', label: 'Africa' },
  { key: 'middle east', label: 'Middle East' },
];

export default function PopularDestinationsCarousel() {
  const carouselRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState('europe');

  useEffect(() => {
    const interval = setInterval(() => {
      const nextBtn = document.querySelector('[data-carousel-next]');
      if (nextBtn) {
        (nextBtn as HTMLButtonElement).click();
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [activeTab]);

  const destinations = destinationsByRegion[activeTab];

  return (
    <section className="relative overflow-hidden py-16">
      {/* Mountain background image */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/popdest/mountain.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
        <div className="flex justify-center mb-8 gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer ${activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Carousel
          ref={carouselRef}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {destinations.map((dest) => (
              <CarouselItem
                key={dest.name}
                className="basis-full sm:basis-1/3 flex-shrink-0"
              >
                <div className="bg-gray-100 rounded-xl shadow-lg hover:shadow-xl/30 transition overflow-hidden cursor-pointer w-full max-w-lg flex flex-col h-full">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 flex-1 flex flex-col items-stretch justify-center gap-2">
                    <span className="text-2xl font-bold mb-1 text-center">{dest.name}</span>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="rounded px-2 py-1 flex justify-between items-center">
                        <span className="font-semibold  text-sm">Emirates</span>
                        <span className=" font-bold text-sm">Flight EK123</span>
                      </div>
                      <div className="rounded px-2 py-1 flex justify-between items-center">
                        <span className="font-semibold text-sm">Qatar Airways</span>
                        <span className=" font-bold text-sm">Flight QR456</span>
                      </div>
                    </div>
                    <div className="rounded px-2 py-1 w-full flex justify-end">
                      <span className="text-blue-700 font-bold text-sm">From $499 </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between items-center mt-4 px-4">
            <CarouselPrevious data-carousel-prev className="bg-white rounded-full shadow p-2 hover:bg-orange-100 transition cursor-pointer">
              <ChevronLeft className="w-7 h-7 text-orange-600" />
            </CarouselPrevious>
            <CarouselNext data-carousel-next className="bg-white rounded-full shadow p-2 hover:bg-orange-100 transition cursor-pointer">
              <ChevronRight className="w-7 h-7 text-orange-600" />
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
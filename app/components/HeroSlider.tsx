'use client';

import React from 'react';

const slides = [
  { image: '/slider/slide1.jpg', caption: 'Discover New Destinations' },
  { image: '/slider/slide2.jpg', caption: 'Discover Greece' },
  { image: '/slider/slide3.jpg', caption: 'Travel with Ease' },
  { image: '/slider/slide4.jpg', caption: 'Adventure Awaits in Rio' },
];

export default function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState<'left' | 'right'>('right');

  const handlePrev = () => {
    setDirection('left');
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen max-w-none relative overflow-hidden h-[100vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {slides.map((slide, idx) => {
        let position = '';
        if (idx === current) {
          position = 'translate-x-0 z-10 opacity-100';
        } else if (
          (idx === (current - 1 + slides.length) % slides.length && direction === 'right') ||
          (idx === (current + 1) % slides.length && direction === 'left')
        ) {
          position = direction === 'right'
            ? '-translate-x-full z-0 opacity-0'
            : 'translate-x-full z-0 opacity-0';
        } else {
          position = 'opacity-0 pointer-events-none';
        }

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1400ms] ease-in-out ${position}`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <span
                className={`
                  text-white text-2xl sm:text-4xl font-bold drop-shadow-lg
                  transition-all duration-[1600ms] ease-out
                  ${idx === current
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'}
                `}
              >
                {slide.caption}
              </span>
            </div>
          </div>
        );
      })}
      {/* Left Arrow */}
      <button
        aria-label="Previous Slide"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Right Arrow */}
      <button
        aria-label="Next Slide"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
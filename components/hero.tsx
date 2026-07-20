"use client";

import { useState, useEffect, useRef } from "react";

const banners = [
  {
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(1).png",
    title: "Yemnest Banner 1",
  },
  {
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(3).png",
    title: "Yemnest Banner 2",
  },
  {
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(6).png",
    title: "Yemnest Banner 3",
  },
  {
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(2).png",
    title: "Yemnest Banner 4",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const handlePrev = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    startAutoPlay();
  };

  const handleNext = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    startAutoPlay();
  };

  const handleDotClick = (index: number) => {
    stopAutoPlay();
    setCurrentIndex(index);
    startAutoPlay();
  };

  return (
    <section className="relative w-full aspect-[2.2/1] max-h-[38vh] sm:max-h-[48vh] md:max-h-[53vh] lg:max-h-[58vh] overflow-hidden bg-black group/hero">
      {/* Slider Container */}
      <div className="absolute inset-0 w-full h-full">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <a
              href="/shop"
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out cursor-pointer ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Full Bleed Image (object-cover fills the aspect ratio naturally) */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover select-none animate-fade-in"
              />
            </a>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-none bg-black/35 hover:bg-black/60 text-white/80 hover:text-white transition-all opacity-0 group-hover/hero:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-none bg-black/35 hover:bg-black/60 text-white/80 hover:text-white transition-all opacity-0 group-hover/hero:opacity-100 focus:opacity-100"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-1.5 rounded-none transition-all duration-300 ${idx === currentIndex ? "w-8 bg-[#F5E6C4]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    title: "Find Your Perfect Medical & Academic Tutor",
    description: "Connect with certified professionals and top-tier tutors specialized in complex medical fields and digital sciences.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    tag: "Expert Guidance"
  },
  {
    id: 2,
    title: "Flexible Timings That Fit Your Busy Schedule",
    description: "Book customized 1-on-1 online learning sessions based on real-time subject availability and flexible hours.",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200&auto=format&fit=crop",
    tag: "Learn Anywhere"
  },
  {
    id: 3,
    title: "Master Your Concepts with MediQueue",
    description: "Elevate your academic performance through structured interactive lessons, dedicated problem solving, and mentorship.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tag: "Accelerate Growth"
  }
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    
    <div className="relative w-full min-h-105 h-[calc(100vh-64px)] md:h-137.5 lg:h-150 flex items-center overflow-hidden bg-slate-900">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center md:bg-top-right"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        >
         
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 sm:via-slate-900/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 text-white py-8 md:py-0">
        <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-6">
          
          <motion.span 
            key={`tag-${current}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
          >
            {slides[current].tag}
          </motion.span>

          <motion.h1
            key={`title-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
          >
            {slides[current].title}
          </motion.h1>

          <motion.p
            key={`desc-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-md sm:max-w-none"
          >
            {slides[current].description}
          </motion.p>

          <motion.div
            key={`btn-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-1 md:pt-2"
          >
            <Link
              href="/tutors"
              className="inline-flex items-center space-x-2 bg-linear-to-r from-emerald-600 to-teal-500 hover:opacity-95 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <span>Explore Tutors</span>
              <FiArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>

      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors duration-200 focus:outline-none backdrop-blur-sm hidden md:block cursor-pointer z-20"
        aria-label="Previous Slide"
      >
        <FiChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors duration-200 focus:outline-none backdrop-blur-sm hidden md:block cursor-pointer z-20"
        aria-label="Next Slide"
      >
        <FiChevronRight className="h-6 w-6" />
      </button>

      
      <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
              current === index ? 'w-6 bg-emerald-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
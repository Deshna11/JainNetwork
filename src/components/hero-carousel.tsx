'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
}

export const HERO_POSTERS: CarouselSlide[] = [
  {
    id: 1,
    image: '/carousel/poster-1.jpg',
    title: 'A Network Built For Every Professional',
    subtitle: 'Connect with Lawyers, CAs, Doctors, Financial Advisors, Builders, and Entrepreneurs across India.',
    badge: 'Professional Network',
    ctaText: 'Join The Network',
    ctaLink: '/register',
  },
  {
    id: 2,
    image: '/carousel/poster-2.jpg',
    title: 'One Connection Can Change Everything',
    subtitle: 'Unlock Referrals, Strategic Partnerships, Business Expansion, and Lasting Community Impact.',
    badge: 'Unlimited Growth',
    ctaText: 'Explore Directory',
    ctaLink: '/businesses',
  },
  {
    id: 3,
    image: '/carousel/poster-3.jpg',
    title: 'Connect. Collaborate. Grow.',
    subtitle: 'Build meaningful business relationships rooted in credibility, trust, and shared values.',
    badge: 'Community First',
    ctaText: 'Find Businesses',
    ctaLink: '/businesses',
  },
  {
    id: 4,
    image: '/carousel/poster-4.jpg',
    title: 'One Network. Endless Opportunities.',
    subtitle: '8 Powerful ways Arham Business Connect accelerates your business lead generation and growth.',
    badge: '8 Growth Drivers',
    ctaText: 'Register Business',
    ctaLink: '/register',
  },
  {
    id: 5,
    image: '/carousel/poster-5.jpg',
    title: 'Welcome to the Future of Business Networking',
    subtitle: 'Discover verified professionals, exclusive events, and strategic collaborative opportunities.',
    badge: 'Next-Gen Networking',
    ctaText: 'Get Started Now',
    ctaLink: '/register',
  },
  {
    id: 6,
    image: '/carousel/poster-6.jpg',
    title: 'One Ecosystem. Endless Possibilities.',
    subtitle: 'Real Estate, Manufacturing, Healthcare, IT, Retail, Financial & Legal Services united for growth.',
    badge: 'Multi-Industry Ecosystem',
    ctaText: 'Browse Categories',
    ctaLink: '/businesses',
  },
  {
    id: 7,
    image: '/carousel/poster-7.jpg',
    title: 'Your Next Opportunity Starts Right Here',
    subtitle: 'Join a trusted community of leaders committed to driving mutual success and long-term value.',
    badge: 'Exclusive Membership',
    ctaText: 'Join Arham Connect',
    ctaLink: '/register',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Touch gesture support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_POSTERS.length;

  // Autoplay timer (4 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext(); // Swiped left -> next slide
    } else if (distance < -minSwipeDistance) {
      goToPrev(); // Swiped right -> prev slide
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = HERO_POSTERS[currentIndex];

  return (
    <section
      aria-label="Hero Carousel Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 py-8 text-white shadow-2xl"
    >
      {/* Ambient background blur effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={currentSlide.image}
          alt=""
          className="h-full w-full object-cover blur-3xl scale-125 transition-all duration-1000"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Showcase Container */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Interactive Poster Card */}
          <div className="flex justify-center lg:col-span-6 lg:justify-end">
            <div className="relative group max-w-md w-full overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-black/40 shadow-2xl backdrop-blur-md transition-all duration-700 hover:border-amber-400">
              {/* Badge */}
              <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Slide Counter */}
              <div className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-mono font-bold text-amber-300 backdrop-blur-md">
                {currentIndex + 1} / {totalSlides}
              </div>

              {/* Poster Image Display */}
              <Link href={currentSlide.ctaLink} className="block relative aspect-[2/3] w-full overflow-hidden">
                {HERO_POSTERS.map((slide, idx) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute inset-0 h-full w-full object-contain bg-slate-950 transition-opacity duration-700 ease-in-out ${
                      idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />
                ))}
              </Link>
            </div>
          </div>

          {/* Right Column: Slide Text & Call-To-Action */}
          <div className="space-y-6 lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="h-4 w-4" /> ARHAM BUSINESS CONNECT SHOWCASE
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {currentSlide.title}
            </h2>

            <p className="max-w-xl text-base text-blue-100 sm:text-lg leading-relaxed">
              {currentSlide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href={currentSlide.ctaLink}>
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-base shadow-xl rounded-xl">
                  {currentSlide.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {/* Pause / Play Indicator */}
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-amber-300 transition-colors"
              >
                {isPaused ? <Play className="h-4 w-4 text-emerald-400" /> : <Pause className="h-4 w-4 text-amber-400" />}
                <span>{isPaused ? 'Paused (Click to Resume)' : 'Autoplaying (Hover to Pause)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Controls Row */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {HERO_POSTERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-amber-400 shadow-lg ring-2 ring-amber-300/40'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Left/Right Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous Slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next Slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

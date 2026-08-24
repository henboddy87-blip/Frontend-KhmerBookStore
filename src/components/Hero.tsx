import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useCountUp } from '../hooks/useCountUp';

interface HeroProps {
  onShopNow: () => void;
  onCategoryChange: (cat: string) => void;
}

export function Hero({ onShopNow, onCategoryChange }: HeroProps) {
  const { t } = useStore();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const booksCount = useCountUp({ end: 1000, duration: 2200, suffix: '+' });
  const readersCount = useCountUp({ end: 10000, duration: 2500, suffix: '+' });

  const slides = useMemo(() => [
    {
      badge: t('heroBadge1'),
      title: t('heroTitle1'),
      highlight: t('heroHighlight1'),
      subtitle: t('heroSubtitle1'),
      cta: t('heroCTA1'),
      ctaCat: 'all',
      image: '/images/personal-development/1.jpg',
      featuredBook: {
        cover: '/images/personal-development/1.jpg',
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen Covey',
        rating: 4.9,
      }
    },
    {
      badge: t('heroBadge2'),
      title: t('heroTitle2'),
      highlight: t('heroHighlight2'),
      subtitle: t('heroSubtitle2'),
      cta: t('heroCTA2'),
      ctaCat: 'fiction',
      image: '/images/novel/Picture1.png',
      featuredBook: {
        cover: '/images/novel/Picture1.png',
        title: 'ពណ៍ស្វាយ',
        author: 'ស្រីល័ក្ខណា',
        rating: 4.7,
      }
    },
    {
      badge: t('heroBadge3'),
      title: t('heroTitle3'),
      highlight: t('heroHighlight3'),
      subtitle: t('heroSubtitle3'),
      cta: t('heroCTA3'),
      ctaCat: 'selfHelp',
      image: '/images/finance/9.jpg',
      featuredBook: {
        cover: '/images/finance/9.jpg',
        title: 'The Lean Start Up',
        author: 'Eric Ries',
        rating: 4.8,
      }
    },
    {
      badge: t('heroBadge4'),
      title: t('heroTitle4'),
      highlight: t('heroHighlight4'),
      subtitle: t('heroSubtitle4'),
      cta: t('heroCTA4'),
      ctaCat: 'khmerLiterature',
      image: '/images/khmer-literature/khmer1.jpg',
      featuredBook: {
        cover: '/images/khmer-literature/khmer1.jpg',
        title: 'Kong Hean',
        author: 'The world of stories',
        rating: 4.5,
      }
    },
    {
      badge: t('heroBadge5'),
      title: t('heroTitle5'),
      highlight: t('heroHighlight5'),
      subtitle: t('heroSubtitle5'),
      cta: t('heroCTA5'),
      ctaCat: 'children',
      image: '/images/children/9.jpg',
      featuredBook: {
        cover: '/images/children/9.jpg',
        title: 'The Wild Robot',
        author: 'Peter Brown',
        rating: 4.9,
      }
    },
    {
      badge: t('heroBadge6' as any),
      title: t('heroTitle6' as any),
      highlight: t('heroHighlight6' as any),
      subtitle: t('heroSubtitle6' as any),
      cta: t('heroCTA6' as any),
      ctaCat: 'selfHelp',
      image: '/images/personal-development/10.jpg',
      featuredBook: { 
        cover: '/images/personal-development/10.jpg', 
        title: 'The Miracle Morning', 
        author: 'Hal Elrod', 
        rating: 4.9 
      }
    },
    {
      badge: t('heroBadge7' as any),
      title: t('heroTitle7' as any),
      highlight: t('heroHighlight7' as any),
      subtitle: t('heroSubtitle7' as any),
      cta: t('heroCTA7' as any),
      ctaCat: 'biography',
      image: '/images/biography/1.jpg',
      featuredBook: { 
        cover: '/images/biography/1.jpg', 
        title: 'Steve Jobs', 
        author: 'Walter Isaacson', 
        rating: 4.2 
      }
    },
    {
      badge: t('heroBadge8' as any),
      title: t('heroTitle8' as any),
      highlight: t('heroHighlight8' as any),
      subtitle: t('heroSubtitle8' as any),
      cta: t('heroCTA8' as any),
      ctaCat: 'health',
      image: '/images/health/2.jpg',
      featuredBook: { 
        cover: '/images/health/2.jpg', 
        title: 'Outlive', 
        author: 'Peter Attia', 
        rating: 4.8 
      }
    },
    {
      badge: t('heroBadge9' as any),
      title: t('heroTitle9' as any),
      highlight: t('heroHighlight9' as any),
      subtitle: t('heroSubtitle9' as any),
      cta: t('heroCTA9' as any),
      ctaCat: 'finance',
      image: '/images/finance/9.jpg',
      featuredBook: { 
        cover: '/images/finance/9.jpg', 
        title: 'The Psychology of Money', 
        author: 'Morgan Housel', 
        rating: 4.8 
      }
    },
    {
      badge: t('heroBadge10' as any),
      title: t('heroTitle10' as any),
      highlight: t('heroHighlight10' as any),
      subtitle: t('heroSubtitle10' as any),
      cta: t('heroCTA10' as any),
      ctaCat: 'art',
      image: '/images/art/2.jpg',
      featuredBook: { 
        cover: '/images/art/2.jpg', 
        title: 'The Creative Act', 
        author: 'Rick Rubin', 
        rating: 4.7 
      }
    },
    {
      badge: t('heroBadge11' as any),
      title: t('heroTitle11' as any),
      highlight: t('heroHighlight11' as any),
      subtitle: t('heroSubtitle11' as any),
      cta: t('heroCTA11' as any),
      ctaCat: 'nonFiction',
      image: '/images/non-fiction/4.jpg',
      featuredBook: { 
        cover: '/images/non-fiction/4.jpg', 
        title: 'Sapiens', 
        author: 'Yuval Noah Harari', 
        rating: 4.7 
      }
    },
    {
      badge: t('heroBadge12' as any),
      title: t('heroTitle12' as any),
      highlight: t('heroHighlight12' as any),
      subtitle: t('heroSubtitle12' as any),
      cta: t('heroCTA12' as any),
      ctaCat: 'technology',
      image: '/images/finance/14.jpg',
      featuredBook: { 
        cover: '/images/finance/14.jpg', 
        title: 'Hooked', 
        author: 'Nir Eyal', 
        rating: 4.6 
      }
    },
  ], [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  const goTo = (idx: number) => {
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300);
  };

  return (
    <section className="bg-black relative overflow-hidden transition-colors duration-500 pt-12 pb-20 md:pt-20 md:pb-32 min-h-[600px] flex items-center group/hero">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={slide.image} 
          alt="Cinematic Background" 
          className={`w-full h-full object-cover opacity-30 blur-sm transition-transform duration-[2000ms] ease-out ${animating ? 'scale-110' : 'scale-100'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/50" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (7 cols) */}
          <div className={`lg:col-span-6 xl:col-span-5 transition-all duration-700 ease-out ${animating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {slide.badge}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 drop-shadow-lg" style={{ fontFamily: 'Merriweather, serif' }}>
              {slide.title} <br />
              <span className="text-emerald-700">
                {slide.highlight}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed drop-shadow-md">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-10 md:mb-14">
              <button 
                onClick={() => { onCategoryChange(slide.ctaCat); onShopNow(); }} 
                className="px-8 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {slide.cta} 
              </button>
              <button 
                onClick={onShopNow} 
                className="px-8 py-3.5 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-full font-bold transition-colors backdrop-blur-sm cursor-pointer"
              >
                {t('viewAllBooks')}
              </button>
            </div>

            {/* Clean Stats */}
            <div className="flex items-center gap-8 md:gap-12 pt-8 border-t border-white/10">
              <div>
                <p ref={booksCount.ref as React.RefObject<HTMLParagraphElement>} className="text-3xl font-black text-white">{booksCount.display}</p>
                <p className="text-sm font-medium text-gray-400 mt-1">{t('booksAvailable')}</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p ref={readersCount.ref as React.RefObject<HTMLParagraphElement>} className="text-3xl font-black text-white">{readersCount.display}</p>
                <p className="text-sm font-medium text-gray-400 mt-1">{t('happyReaders')}</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition (5 cols) */}
          <div className="lg:col-span-6 xl:col-span-7 relative h-full flex items-center justify-center order-first lg:order-last mt-4 lg:mt-0 pb-8 lg:pb-0">
            <div className={`relative w-full max-w-[500px] sm:aspect-[4/3] flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${animating ? 'opacity-0 scale-90 translate-y-8' : 'opacity-100 scale-100 translate-y-0'}`}>
              <div className="relative w-44 h-64 sm:w-52 sm:h-72 md:w-56 md:h-80 lg:w-64 lg:h-96 group/stack">
                {slides.map((s, index) => {
                  let diff = index - current;
                  if (diff < 0) diff += slides.length;

                  let zIndex = 50 - diff * 10;
                  
                  // Fan effect math
                  let rotate = diff === 0 ? -6 : -6 + diff * 14;
                  let translateX = diff === 0 ? -50 : -50 + diff * 40;
                  let translateY = diff === 0 ? 20 : 20 - diff * 12;
                  let scale = 1.05 - (diff * 0.04);

                  return (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full transition-all duration-[800ms] ease-out rounded-lg overflow-hidden border border-white/20 bg-gray-900 group-hover/stack:scale-105"
                      style={{
                        zIndex,
                        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                        boxShadow: diff === 0 
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0,0,0,0.4)' 
                          : '0 15px 35px -5px rgba(0, 0, 0, 0.7)',
                        opacity: diff > 3 ? 0 : 1, // Only show 4 books to prevent clutter
                      }}
                    >
                      <img
                        src={s.featuredBook.cover}
                        alt={s.featuredBook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Paginator Lines */}
        <div className="mt-10 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 flex justify-center gap-2 w-full lg:w-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current 
                ? 'bg-emerald-500 w-8' 
                : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
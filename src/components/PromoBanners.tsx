import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function PromoBanners() {
  const [leftRef, leftVisible] = useScrollReveal();
  const [rightRef, rightVisible] = useScrollReveal();

  return (
    <div className="bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-white/5 py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Banner - Purple */}
          <div ref={leftRef} className={`relative bg-[#6f5e9c] dark:bg-indigo-900 rounded-3xl overflow-hidden min-h-[220px] flex items-center p-6 sm:p-10 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg group reveal-left ${leftVisible ? 'revealed' : ''}`}>
            {/* Background Decor */}
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            
            <div className="relative z-10 flex w-full">
              {/* Image side (left) */}
              <div className="w-1/3 relative flex items-center justify-center">
                <div className="relative z-10 w-24 h-28 sm:w-32 sm:h-36 bg-[#8b7ab6] rounded-xl shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 border-4 border-white/20 flex items-center justify-center overflow-hidden">
                   {/* Decorative Gift Box representation */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                   <div className="w-full h-4 bg-[#e83e8c] absolute top-1/2 -translate-y-1/2 shadow-sm" />
                   <div className="h-full w-4 bg-[#e83e8c] absolute left-1/2 -translate-x-1/2 shadow-sm" />
                </div>
                
                {/* Sale Badge */}
                <div className="absolute -top-4 -right-4 sm:-right-8 bg-[#e83e8c] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center font-black shadow-xl transform rotate-12 z-20 border-2 border-white/20">
                  <span className="text-[10px] sm:text-xs leading-none uppercase">Sale</span>
                  <span className="text-sm sm:text-lg leading-none">20%</span>
                </div>
              </div>

              {/* Text side (right) */}
              <div className="w-2/3 pl-6 sm:pl-10 flex flex-col justify-center text-white">
                <h3 className="text-2xl sm:text-3xl font-black mb-3 leading-tight" style={{ fontFamily: "Merriweather, serif" }}>
                  Curated Reads<br/>For You
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Discover editor picks, trending novels and life-changing non-fiction.
                </p>
                <Link to="/books" className="inline-block mt-4 text-white font-bold text-sm hover:underline underline-offset-4">
                  Explore Books →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner - Yellow */}
          <div ref={rightRef} className={`relative bg-[#d79737] dark:bg-emerald-700 rounded-3xl overflow-hidden min-h-[220px] flex items-center p-6 sm:p-10 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg group reveal-right ${rightVisible ? 'revealed' : ''}`}>
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors transform translate-x-1/2 -translate-y-1/4" />
            
            <div className="relative z-10 flex w-full">
              {/* Image side (left) */}
              <div className="w-2/5 relative flex items-center justify-center">
                 <div className="relative z-10 w-28 h-32 sm:w-36 sm:h-40 flex items-center justify-center transform -rotate-6 group-hover:-translate-y-2 transition-transform duration-500">
                    <img 
                      src="./images/finance/9.jpg" 
                      alt="Books" 
                      className="w-full h-full object-cover rounded-lg shadow-2xl border-4 border-white/30"
                    />
                 </div>
              </div>

              {/* Text side (right) */}
              <div className="w-3/5 pl-4 sm:pl-8 flex flex-col justify-center text-white">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 mb-1">
                  Best sellers book
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-2" style={{ fontFamily: "Merriweather, serif" }}>
                  Sale 10% Off
                </h3>
                <p className="text-white/80 text-sm sm:text-base mb-6">
                  10 categories with a great deal
                </p>
                
                <div>
                  <Link 
                    to="/bestsellers" 
                    className="inline-block bg-white text-[#d79737] dark:text-emerald-800 px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

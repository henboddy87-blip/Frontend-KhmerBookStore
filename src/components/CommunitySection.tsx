import { FaTelegram } from "react-icons/fa";

export function CommunitySection() {
  const telegramLink = import.meta.env.VITE_TELEGRAM_LINK;
  const bgImage = import.meta.env.VITE_COMMUNITY_BG_IMAGE || "./bookclub.png";

  return (
    <section className="py-16 bg-white dark:bg-dark-bg">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div 
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center shadow-2xl flex flex-col items-center bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        >
          {/* Subtle dark overlay for text readability, no blur or color tint */}
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "Merriweather, serif" }}>
              Join Our Reading Community
            </h2>
            
            <p className="text-emerald-50 md:text-lg mb-8 opacity-90 leading-relaxed">
              Connect with fellow book lovers, share your favorite reads, and get exclusive access to upcoming book releases and flash sales!
            </p>
            
            <a
              href={telegramLink || "https://t.me/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-emerald-50 text-emerald-950 px-8 py-3.5 rounded-full font-bold text-lg shadow-xl shadow-white/10 transition-all hover:-translate-y-1 active:scale-95"
            >
              <FaTelegram className="w-6 h-6 text-[#229ED9]" />
              <span>Join using Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import {  ArrowRight, Calendar, Tag, Gift } from "lucide-react";
import { useSales } from "../context/SalesContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useStore } from "../context/StoreContext";

interface DynamicCampaignsSectionProps {
  onCategorySelect?: (category: string) => void;
}


export function DynamicCampaignsSection({ onCategorySelect }: DynamicCampaignsSectionProps) {
  const { activeCampaigns } = useSales();
  const { books } = useStore();
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  if (!activeCampaigns || activeCampaigns.length === 0) {
    return null;
  }

  // Format date range nicely
  const formatDateRange = (startDateStr?: string, endDateStr?: string) => {
    if (!startDateStr && !endDateStr) return "Limited Time Campaign";
    const start = startDateStr ? new Date(startDateStr) : null;
    const end = endDateStr ? new Date(endDateStr) : null;

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    if (start && end) {
      return `Valid: ${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`;
    }
    if (end) {
      return `Ends: ${end.toLocaleDateString("en-US", options)}`;
    }
    return "Active Campaign";
  };

  return (
    <section
      ref={sectionRef}
      className={`py-8 bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-white/5 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns.map((camp, idx) => {
            // Find a sample book image in category for visual appeal
            const sampleBook =
              camp.category !== "all"
                ? books.find((b) => b.category === camp.category || b.genre === camp.category)
                : books[idx % books.length];

            const categoryLink =
              camp.category === "all" ? "/books" : `/genre/${camp.category}`;

            return (
              <div
                key={camp.id || idx}
                className={`relative bg-slate-900 bg-gradient-to-br ${
                  camp.bg_gradient || "from-emerald-900 to-teal-900"
                } rounded-3xl overflow-hidden min-h-[240px] flex items-center p-6 sm:p-10 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-2xl group border border-white/10`}
              >
                {/* Background Decor Shapes */}
                <div className="absolute -left-12 -bottom-12 w-52 h-52 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                <div className="relative z-10 flex w-full items-center justify-between gap-6">
                  {/* Text side */}
                  <div className="flex-1 text-white">
                    {/* Campaign Badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                        <Tag className="w-3.5 h-3.5 text-emerald-300" />
                        {camp.discount_percent}% Discount
                      </span>

                      <span className="inline-flex items-center gap-1 bg-black/30 text-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        <Calendar className="w-3 h-3 text-emerald-300" />
                        {formatDateRange(camp.start_date, camp.end_date)}
                      </span>
                    </div>

                    {/* Campaign Title */}
                    <h3
                      className="text-2xl sm:text-3xl font-black mb-2 leading-tight tracking-tight text-white"
                      style={{ fontFamily: "Merriweather, serif" }}
                    >
                      {camp.title}
                    </h3>

                    {/* Campaign Description */}
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-md line-clamp-2">
                      {camp.description ||
                        `Enjoy exclusive ${camp.discount_percent}% off on our top selected titles.`}
                    </p>

                    {/* CTA Button */}
                    <Link
                      to={categoryLink}
                      onClick={() => onCategorySelect && onCategorySelect(camp.category)}
                      className="inline-flex items-center gap-2 bg-white text-zinc-900 hover:bg-emerald-50 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:shadow-xl transition-all active:scale-95 group-hover:gap-3"
                    >
                      <span>Explore Deals</span>
                      <ArrowRight className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  {/* Visual Side (Book Preview or Badge) */}
                  <div className="hidden sm:flex relative items-center justify-center flex-shrink-0 w-32 sm:w-40">
                    <div className="relative z-10 w-28 h-36 sm:w-32 sm:h-44 transform -rotate-6 group-hover:rotate-0 group-hover:-translate-y-2 transition-transform duration-500 rounded-xl overflow-hidden shadow-2xl border-4 border-white/25 bg-white/10 flex items-center justify-center">
                      {sampleBook?.image ? (
                        <img
                          src={sampleBook.image}
                          alt={sampleBook.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gift className="w-12 h-12 text-white/60" />
                      )}
                    </div>

                    {/* Floating Percent Badge */}
                    <div className="absolute -top-3 -right-3 bg-emerald-600 text-white w-14 h-14 rounded-full flex flex-col items-center justify-center font-black shadow-xl transform rotate-12 z-20 border-2 border-white/30">
                      <span className="text-[9px] uppercase leading-none">Sale</span>
                      <span className="text-sm font-extrabold leading-none mt-0.5">
                        {camp.discount_percent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

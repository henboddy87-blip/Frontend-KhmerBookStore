import { useRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Book } from "../types";
import { BookCard } from "./BookCard";

interface BookRowSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: ReactNode;
  books: Book[];
  viewAllLink?: string;
  viewAllText?: string;
  onBookClick: (book: Book) => void;
  accentColor?: "emerald" | "emerald" | "red" | "purple" | "blue";
  loading?: boolean;
}

export function BookRowSection({
  title,
  subtitle,
  badge,
  badgeIcon,
  books,
  viewAllLink,
  viewAllText = "View All",
  onBookClick,
  accentColor = "emerald",
  loading = false,
}: BookRowSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = Math.min(scrollRef.current.clientWidth * 0.75, 600);
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getBadgeColors = () => {
    switch (accentColor) {
      case "emerald":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "red":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
      case "purple":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <section className="py-10 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-2 ${getBadgeColors()}`}>
                {badgeIcon}
                {badge}
              </span>
            )}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors group"
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {/* Scroll Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Scroll left"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Scroll right"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Row Horizontal Slider */}
        {loading ? (
          <div
            className="flex gap-4 sm:gap-6 overflow-x-hidden pb-4 pt-1 px-1 -mx-4 sm:-mx-6 px-4 sm:px-6"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex-none w-[170px] sm:w-[220px] md:w-[240px]"
              >
                <div className="flex flex-col bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 animate-pulse h-full min-h-[300px]">
                  <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 w-full" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    <div className="mt-auto flex justify-between items-center">
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-dark-card/50 rounded-2xl border border-gray-100 dark:border-white/5 text-gray-400 text-sm font-medium">
            No books found in this collection.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6 scroll-smooth snap-x"
          >
            {books.map((book) => (
              <div
                key={book.id}
                className="flex-none w-[170px] sm:w-[220px] md:w-[240px] snap-start"
              >
                <BookCard book={book} onBookClick={onBookClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

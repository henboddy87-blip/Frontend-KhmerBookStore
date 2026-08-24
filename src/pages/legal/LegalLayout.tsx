import { Link } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";

// ─── Shared Layout ────────────────────────────────────────────────────────────
export function LegalLayout({
  badge,
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      {/* Hero Banner */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/40 py-16 px-4 text-center border-b border-emerald-100 dark:border-white/5 transition-colors duration-500">
        <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-800 dark:text-emerald-300 text-[16px] font-semibold tracking-widest uppercase mb-5 border border-emerald-200 dark:border-white/10">
          {badge}
        </span>
        <h1
          className="text-[48px] font-black mb-4 text-gray-900 dark:text-white leading-tight"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {title}
        </h1>
        <p className="text-gray-500 dark:text-emerald-300/80 max-w-xl mx-auto text-[20px] leading-relaxed font-medium">
          {subtitle}
        </p>
        <p className="mt-4 text-emerald-600 dark:text-emerald-500 text-[16px] font-bold">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-14">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-emerald-100 dark:border-white/5 p-8 md:p-12 space-y-10 text-emerald-950 dark:text-gray-300">
          {children}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-900 text-white rounded-full font-bold text-[20px] hover:bg-emerald-800 transition-all shadow"
          >
             Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

// ─── Reusable section block ────────────────────────────────────────────────────
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-[34px] font-black text-emerald-900 dark:text-emerald-400 mb-4 pb-2 border-b border-emerald-100 dark:border-white/5 leading-tight"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {title}
      </h2>
      <div className="text-[20px] text-emerald-800/80 dark:text-gray-400 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}

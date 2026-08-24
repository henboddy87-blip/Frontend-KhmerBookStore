import { useNavigate } from "react-router-dom";

/* ── Shared helpers ── */

export function PageHero({
  icon: Icon,
  title,
  subtitle,
  crumb,
}: {
  icon: any;
  title: string;
  subtitle: string;
  crumb: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-emerald-50/50 dark:bg-emerald-950/40 py-16 relative overflow-hidden border-b border-emerald-100 dark:border-white/5 transition-colors duration-500">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2392400e'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-4xl mx-auto px-4 relative text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
          <button
            onClick={() => navigate("/")}
            className="hover:text-emerald-900 dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <span>›</span>
          <span className="text-emerald-900 dark:text-white">{crumb}</span>
        </div>
        <Icon
          size={48}
          className="text-emerald-600 dark:text-emerald-400 mx-auto mb-4"
        />
        <h1
          className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {title}
        </h1>
        <p className="text-gray-500 dark:text-emerald-200/70 mt-3 text-lg font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-emerald-100 dark:border-white/5 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-white/5 rounded-lg flex items-center justify-center text-emerald-900 dark:text-emerald-400">
          <Icon size={20} />
        </div>
        <h3
          className="text-lg font-black text-emerald-900 dark:text-emerald-400"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

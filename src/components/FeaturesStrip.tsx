import { Truck as FaTruck, RotateCcw as FaRotateCcw, Package as FaPackage, ShieldCheck as FaShieldCheck, LucideIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TranslationKey } from '../data/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function FeaturesStrip() {
  const { t } = useStore();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  const FEATURES: { Icon: LucideIcon; title: TranslationKey; desc: TranslationKey }[] = [
    { Icon: FaTruck, title: 'freeShippingTitle', desc: 'freeShippingDesc' },
    { Icon: FaRotateCcw, title: 'returnsTitle', desc: 'returnsDesc' },
    { Icon: FaPackage, title: 'booksCountTitle', desc: 'booksCountDesc' },
    { Icon: FaShieldCheck, title: 'secureCheckoutTitle', desc: 'secureCheckoutDesc' },
  ];

  return (
    <div className="bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f, index) => (
            <div
              key={f.title}
              className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-emerald-50 dark:hover:bg-white/5 transition-all group reveal-scale stagger-${index + 1} ${isVisible ? 'revealed' : ''}`}
            >
              <div className="w-14 h-14 bg-emerald-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-white/10 transition-all">
                <f.Icon size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{t(f.title)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(f.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

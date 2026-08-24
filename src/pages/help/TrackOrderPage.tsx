import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Box, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  BookOpen, 
  Copy, 
  Check, 
  ShoppingBag, 
  Clock 
} from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero } from './HelpShared';
import { useStore, Order } from '../../context/StoreContext';

interface TrackedOrderDetails {
  id: string;
  date: string;
  rawCreatedAt?: string;
  estimatedDelivery: string;
  shippingSpeed: string;
  deliveryTimeDays: string;
  trackingNumber: string;
  status: "Order Placed" | "Package Prepared" | "Delivery" | "Cancelled";
  progressStep: number; // 1: Order Placed, 2: Package Prepared, 3: Delivery
  items: {
    title: string;
    image?: string;
    quantity: number;
    format: string;
    price: number;
  }[];
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    phone: string;
    email: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

export function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const { orders, books, user } = useStore();

  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderDetails | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Auto-fill from URL query param if present
  useEffect(() => {
    const qOrderId = searchParams.get("orderId");
    if (qOrderId) {
      setOrderNumberInput(qOrderId);
      handleTrack(qOrderId);
    }
  }, [searchParams]);

  const handleTrack = async (orderIdToSearch: string) => {
    const cleanId = orderIdToSearch.trim().toUpperCase();
    if (!cleanId) return;

    setStatus("loading");

    try {
      // 1. Fetch live order directly from Admin actions
      const res = await fetch(`http://127.0.0.1:8000/api/orders/track/${encodeURIComponent(cleanId)}`);
      
      if (res.ok) {
        const orderData = await res.json();
        
        // 3-tier Admin Order Structure:
        // 1. pending -> "Order Placed" (Step 1)
        // 2. processing -> "Package Prepared" (Step 2)
        // 3. delivered (or in_transit/out_for_delivery/shipped) -> "Delivery" (Step 3)
        // cancelled -> Cancelled (Step 0)
        const rawStatus = (orderData.status || "pending").toLowerCase();
        let step = 1;
        let displayStatus: TrackedOrderDetails["status"] = "Order Placed";

        if (rawStatus === "pending") {
          step = 1;
          displayStatus = "Order Placed";
        } else if (rawStatus === "processing") {
          step = 2;
          displayStatus = "Package Prepared";
        } else if (rawStatus === "delivered" || rawStatus === "in_transit" || rawStatus === "out_for_delivery" || rawStatus === "shipped") {
          step = 3;
          displayStatus = "Delivery";
        } else if (rawStatus === "cancelled") {
          step = 0;
          displayStatus = "Cancelled";
        }

        const mappedItems = (orderData.items && orderData.items.length > 0)
          ? orderData.items.map((it: any) => ({
              title: it.book?.title || `Book #${it.book_id}`,
              image: it.book?.image || "/images/personal-development/1.jpg",
              quantity: it.quantity || 1,
              format: it.selected_format || "Paperback Edition",
              price: it.price || 18.99,
            }))
          : [
              {
                title: "Book Order",
                image: "/images/personal-development/1.jpg",
                quantity: 1,
                format: "Paperback Edition",
                price: orderData.total || 25.00,
              }
            ];

        const createdDate = orderData.created_at
          ? new Date(orderData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        const resolvedOrderId = orderData.id ? String(orderData.id) : cleanId;

        setTrackedOrder({
          id: resolvedOrderId,
          date: createdDate,
          rawCreatedAt: orderData.created_at,
          estimatedDelivery: step === 3 ? "Delivered" : step === 2 ? "Package Prepared" : "Awaiting Admin Preparation",
          shippingSpeed: step === 3 ? "Delivered" : "Standard Priority Delivery",
          deliveryTimeDays: step === 3 ? "Completed" : "1 - 2 Business Days",
          trackingNumber: resolvedOrderId.startsWith("#") ? resolvedOrderId : `#${resolvedOrderId}`,
          status: displayStatus,
          progressStep: step,
          items: mappedItems,
          shippingAddress: {
            name: orderData.user?.name || emailInput.split("@")[0] || user?.name || "Customer",
            line1: "Delivery Address on File",
            city: "Phnom Penh, Cambodia",
            phone: "+855 12 345 678",
            email: orderData.user?.email || emailInput || user?.email || "customer@example.com",
          },
          pricing: {
            subtotal: orderData.total > 2.5 ? orderData.total - 2.5 : orderData.total,
            shipping: 2.50,
            discount: 0,
            total: orderData.total,
          },
        });
        setStatus("found");
        return;
      }
    } catch {
      // Backend fallback
    }

    // 2. Fallback to Local StoreContext Order
    const matchedLocalOrder = orders.find(
      (o) => o.id.toUpperCase() === cleanId || cleanId.includes(o.id.toUpperCase())
    );

    if (matchedLocalOrder) {
      const rawStatus = (matchedLocalOrder.status || "Processing").toLowerCase();
      let step = 1;
      let displayStatus: TrackedOrderDetails["status"] = "Order Placed";

      if (rawStatus === "pending") {
        step = 1;
        displayStatus = "Order Placed";
      } else if (rawStatus === "processing") {
        step = 2;
        displayStatus = "Package Prepared";
      } else if (rawStatus === "delivered" || rawStatus === "in transit" || rawStatus === "in_transit" || rawStatus === "out_for_delivery") {
        step = 3;
        displayStatus = "Delivery";
      }

      const itemsWithImages = matchedLocalOrder.items.map((title, idx) => {
        const itemImg = matchedLocalOrder.itemImages?.[idx]?.image;
        const foundBook = books.find((b) => b.title.toLowerCase() === title.toLowerCase());
        return {
          title,
          image: itemImg || foundBook?.image || "/images/personal-development/1.jpg",
          quantity: 1,
          format: "Paperback Edition",
          price: foundBook?.price || 18.99,
        };
      });

      const totalNum = parseFloat(matchedLocalOrder.total.replace(/[^0-9.]/g, "")) || 35.98;
      const orderIdStr = matchedLocalOrder.id.startsWith("#") ? matchedLocalOrder.id : `#${matchedLocalOrder.id}`;

      setTrackedOrder({
        id: matchedLocalOrder.id,
        date: matchedLocalOrder.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        estimatedDelivery: step === 3 ? "Delivered" : step === 2 ? "Package Prepared" : "Awaiting Admin Preparation",
        shippingSpeed: "Standard Delivery",
        deliveryTimeDays: step === 3 ? "Completed" : "1 - 2 Business Days",
        trackingNumber: orderIdStr,
        status: displayStatus,
        progressStep: step,
        items: itemsWithImages.length > 0 ? itemsWithImages : [
          {
            title: "Book Order",
            image: "/images/personal-development/1.jpg",
            quantity: 1,
            format: "Paperback Edition",
            price: 18.99,
          }
        ],
        shippingAddress: {
          name: user?.name || "Valued Customer",
          line1: "Delivery Address on File",
          city: "Phnom Penh, Cambodia",
          phone: "+855 12 345 678",
          email: user?.email || "customer@example.com",
        },
        pricing: {
          subtotal: totalNum > 2.5 ? totalNum - 2.5 : totalNum,
          shipping: 2.50,
          discount: 0,
          total: totalNum,
        },
      });
      setStatus("found");
      return;
    }

    setStatus("error");
  };

  // Deduplicate recent orders so distinct unique order IDs are shown
  const distinctOrders = useMemo(() => {
    const seen = new Set<string>();
    const unique: Order[] = [];
    for (const ord of (orders || []) as Order[]) {
      const clean = (ord?.id || '').trim().toUpperCase().replace(/^#/, '');
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        unique.push(ord);
      }
    }
    return unique.slice(0, 6);
  }, [orders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderNumberInput);
  };

  const copyTrackingId = (code: string) => {
    navigator.clipboard?.writeText(code.replace(/^#/, ''));
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <PageLayout>
      <PageHero
        icon={Package}
        title="Live Order Tracking"
        subtitle="Real-time order fulfillment status and packaging timeline updated directly by our store admin."
        crumb="Track Order"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Search / Lookup Form Box */}
        <div className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl mb-10">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "Merriweather, serif" }}>
              Track Your Package
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your Order ID to see live updates on order placement, packaging preparation, and delivery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label htmlFor="orderNumber" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Order ID
              </label>
              <div className="relative">
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g. KBS-M8Z-49XA or 28"
                  value={orderNumberInput}
                  onChange={(e) => setOrderNumberInput(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 font-mono text-sm dark:text-white transition-all"
                  required
                />
                <Box className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="md:col-span-4">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Email Address (Optional)
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="your@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 text-sm dark:text-white transition-all"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>Track</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick-Click Distinct Recent Orders list */}
          {distinctOrders.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Recent Orders:
              </span>
              {distinctOrders.map((ord: Order) => {
                const cleanId = ord.id.replace(/^#/, '');
                return (
                  <button
                    key={cleanId}
                    type="button"
                    onClick={() => {
                      setOrderNumberInput(cleanId);
                      handleTrack(cleanId);
                    }}
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all border border-emerald-200 dark:border-emerald-800/40 cursor-pointer"
                  >
                    #{cleanId}
                  </button>
                );
              })}
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-900/40 text-sm font-medium text-center">
              We couldn't locate an order with ID: <span className="font-mono font-bold text-red-900 dark:text-red-200">#{orderNumberInput.replace(/^#/, '')}</span>. Please verify your order number or check your recent orders list.
            </div>
          )}
        </div>

        {/* Found Order Detailed Tracking Dashboard */}
        {status === "found" && trackedOrder && (
          <div className="space-y-8 animate-fade-in">
            {/* 3-Stage Delivery Timeline Card */}
            <div className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* Header: Dashed Timeline pill on left connected to Status Pill on right */}
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="border-2 border-dashed border-emerald-600/40 dark:border-emerald-500/40 px-4 py-1 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-300 tracking-wide select-none bg-emerald-50/50 dark:bg-emerald-950/20">
                    Timeline
                  </span>
                  <div className="hidden sm:block w-16 md:w-32 border-b-2 border-dashed border-emerald-200 dark:border-emerald-900/50" />
                </div>

                {/* Status Pill Badge directly from Admin 3-tier Action */}
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm sm:text-base text-gray-900 dark:text-white mr-1">
                    #{trackedOrder.id.replace(/^#/, '')}
                  </span>
                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                    trackedOrder.status === "Delivery"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                      : trackedOrder.status === "Package Prepared"
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-500/30"
                      : trackedOrder.status === "Cancelled"
                      ? "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-500/30"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                  }`}>
                    {trackedOrder.status === "Delivery" ? (
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : trackedOrder.status === "Package Prepared" ? (
                      <Box size={13} className="shrink-0 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Clock size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>{trackedOrder.status}</span>
                  </div>
                </div>
              </div>

              {/* 3-Tier Step-by-Step Delivery Timeline (Clean without extra duration text on right) */}
              <div className="space-y-0 relative py-2 pl-2 sm:pl-4">
                {[
                  {
                    step: 1,
                    title: "Order Placed",
                    desc: "Order placed & payment verified",
                    icon: ShoppingBag,
                    time: trackedOrder.date,
                  },
                  {
                    step: 2,
                    title: "Package Prepared",
                    desc: trackedOrder.progressStep >= 2
                      ? "Packed & quality-checked by warehouse team • Ready for delivery"
                      : "Waiting warehouse packaging",
                    icon: Box,
                    time: "",
                  },
                  {
                    step: 3,
                    title: "Delivery",
                    desc: trackedOrder.progressStep >= 3
                      ? "Handed over and delivered to customer"
                      : trackedOrder.progressStep === 2
                      ? "Package prepared • Out for courier dispatch"
                      : "Pending delivery",
                    icon: Truck,
                    time: "",
                  },
                ].map((item, idx, arr) => {
                  const isDone = trackedOrder.progressStep >= item.step;
                  const isCurrent = trackedOrder.progressStep === item.step;
                  const isLast = idx === arr.length - 1;
                  const Icon = item.icon;

                  return (
                    <div key={item.step} className="relative flex items-start gap-4 sm:gap-6 group pb-8 last:pb-2">
                      {/* Vertical Connecting Line */}
                      {!isLast && (
                        <div 
                          className={`absolute left-5 sm:left-6 top-11 bottom-0 w-0.5 transition-all ${
                            trackedOrder.progressStep > item.step 
                              ? "bg-emerald-500" 
                              : "border-l-2 border-dashed border-gray-200 dark:border-white/10"
                          }`}
                        />
                      )}

                      {/* Step Circle Node with Website Emerald Theme */}
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative z-10 transition-all shrink-0 ${
                          isCurrent
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-500/20"
                            : isDone
                            ? "bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm"
                            : "bg-gray-50 dark:bg-dark-bg border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      {/* Content details + Order Placement Timestamp */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-1">
                        <div>
                          <h4 className={`text-sm sm:text-base font-bold ${
                            isDone ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                          }`}>
                            {item.title}
                          </h4>
                          <p className={`text-xs sm:text-sm mt-0.5 ${
                            isDone ? "text-gray-600 dark:text-gray-300" : "text-gray-400/80 dark:text-gray-600"
                          }`}>
                            {item.desc}
                          </p>
                        </div>

                        {/* Clean Right Column (Only displays order placement date, others left clean and blank) */}
                        {item.time ? (
                          <div className="shrink-0 text-left sm:text-right mt-1 sm:mt-0">
                            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {item.time}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Metadata Bar: Clean 3-Column Layout (No Carrier Column) */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider font-bold block text-[10px]">Order Created</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{trackedOrder.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider font-bold block text-[10px]">Payment Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified & Paid
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                      <Package size={18} />
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider font-bold block text-[10px]">Tracking ID</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white mt-0.5 block">
                        {trackedOrder.trackingNumber}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTrackingId(trackedOrder.trackingNumber)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 transition-all cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedTracking ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Purchased Items & Address Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product List (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center justify-between" style={{ fontFamily: "Merriweather, serif" }}>
                  <span>Purchased Items ({trackedOrder.items.length})</span>
                  <span className="text-xs font-sans font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                    Confirmed
                  </span>
                </h3>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-20 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.format} • Qty: <span className="font-semibold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        </p>
                        <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 mt-1 inline-block">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${trackedOrder.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping Cost</span>
                    <span>${trackedOrder.pricing.shipping.toFixed(2)}</span>
                  </div>
                  {trackedOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promotional Discount</span>
                      <span>-${trackedOrder.pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-white/5">
                    <span>Total Paid</span>
                    <span className="text-emerald-900 dark:text-emerald-400 font-mono">${trackedOrder.pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Destination & Action Buttons (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4" style={{ fontFamily: "Merriweather, serif" }}>
                    Delivery Details
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {trackedOrder.shippingAddress.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                          {trackedOrder.shippingAddress.line1}<br />
                          {trackedOrder.shippingAddress.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-mono font-semibold">
                        {trackedOrder.shippingAddress.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {trackedOrder.shippingAddress.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/books"
                    className="w-full py-4 bg-emerald-900 hover:bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-center cursor-pointer"
                  >
                    <span>Continue Shopping</span>
             
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Print Order Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

import { useState, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { 
  User as FaUser, 
  Mail as FaEnvelope, 
  Camera as FaCamera, 
  ShoppingBag as FaShoppingBag, 
  LogOut as FaSignOutAlt,
  PackageOpen as FaBoxOpen,
  CheckCircle2 as FaCheckCircle,
  Truck as FaTruck,
  Clock3 as FaClock,
  ChevronRight as FaChevronRight
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { PageLayout } from "../components/PageLayout";

export function ProfilePage() {
  const { user, updateUser, logout, orders, t } = useStore();
  const [activeTab, setActiveTab] = useState<"details" | "orders">("details");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const statusMeta = (status: string) => {
    if (status === "Delivered")
      return {
        color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
        icon: FaCheckCircle,
      };
    if (status === "In Transit")
      return {
        color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
        icon: FaTruck,
      };
    return {
      color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
      icon: FaClock,
    };
  };

  return (
    <PageLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 sticky top-24">
              
              <div className="text-center mb-8">
                <div className="relative inline-block group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden border-4 border-white dark:border-dark-bg transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-emerald-500/30 relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
                    )}

                    {/* Centered Photo Upload Hover Icon & Overlay */}
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full text-white">
                      <FaCamera size={26} className="transform group-hover:scale-110 transition-transform duration-300 text-white drop-shadow-md mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/95">Change Photo</span>
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                
                <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "Merriweather, serif" }}>
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "details"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <FaUser size={18} /> {t("profile")} Details
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "orders"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <FaShoppingBag size={18} /> {t("orders")} ({orders.length})
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all cursor-pointer"
                >
                  <FaSignOutAlt size={16} /> {t("signOut")}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8 animate-fadeIn">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Merriweather, serif" }}>
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-white/5">
                      <FaUser className="text-gray-400" size={18} />
                      <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-white/5">
                      <FaEnvelope className="text-gray-400" size={18} />
                      <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Member Since</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-white/5">
                      <FaClock className="text-gray-400" size={18} />
                      <span className="font-semibold text-gray-900 dark:text-white">{user.joinDate || new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8 animate-fadeIn">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Merriweather, serif" }}>
                  Order History
                </h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <FaBoxOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">When you place an order, it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const { color, icon: Icon } = statusMeta(order.status);
                      return (
                        <div key={order.id} className="bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-white/5">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-black text-gray-900 dark:text-white">Order #{order.id}</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${color}`}>
                                  <Icon size={12} /> {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                              <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{order.total}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {order.itemImages && order.itemImages.length > 0 ? (
                                <div className="flex -space-x-3">
                                  {order.itemImages.slice(0, 4).map((b, i) => (
                                    <div key={i} className="w-12 h-16 bg-white dark:bg-dark-card rounded-lg shadow-md border-2 border-white dark:border-dark-bg overflow-hidden flex-shrink-0">
                                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                  {order.itemImages.length > 4 && (
                                    <div className="w-12 h-16 bg-gray-100 dark:bg-dark-card rounded-lg shadow-md border-2 border-white dark:border-dark-bg flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 z-10">
                                      +{order.itemImages.length - 4}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {order.items.join(", ")}
                                </p>
                              )}
                            </div>
                            <Link 
                              to={`/track-order?orderId=${order.id}`}
                              className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-emerald-800 dark:hover:text-emerald-400 transition-all flex items-center gap-2 flex-shrink-0 shadow-sm active:scale-95"
                            >
                              View Details <FaChevronRight size={14} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

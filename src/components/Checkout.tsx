import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X as FaTimes,
  Check as FaCheck,
  Truck as FaTruck,
  Box as FaBox,
  CreditCard as FaCreditCard,
  MapPin as FaMapMarkerAlt,
  User as FaUser,
  Mail as FaEnvelope,
  Phone as FaPhone,
  Tag as FaTag,
  Star as FaStar,
  Gift as FaGift,
  Info as FaInfoCircle,
  House as FaHome,
  Building2 as FaBuilding,
  LoaderCircle as FaSpinner,
  Calendar as FaCalendarAlt,
  Store,
  BookOpen,
  ShieldCheck,
  QrCode,
  ExternalLink,
  Copy as FaCopy,
  CheckCircle2,
  Upload,
  Trash2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { API_BASE } from "../config";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step =
  | "cart"
  | "address"
  | "shipping"
  | "payment"
  | "review"
  | "confirmation";

const STEPS: Step[] = [
  "cart",
  "address",
  "shipping",
  "payment",
  "review",
  "confirmation",
];
const STEP_LABELS = [
  "Cart",
  "Address",
  "Shipping",
  "Payment",
  "Review",
  "Confirm",
];

const PROMO_CODES: Record<string, number> = {
  BOOKWORM15: 0.15,
  READER20: 0.2,
  SAVE10: 0.1,
  NEWUSER25: 0.25,
};

const SHIPPING_METHODS = [
  {
    id: "cod",
    icon: FaTruck,
    name: "Cash on delivery",
    subtitle: "Pay when you receive the books",
    time: "1-2 days",
    price: () => 1.99,
    badge: null,
  },
  {
    id: "branch",
    icon: Store,
    name: "Logistic Branch collection",
    subtitle: "Pick up at logistic branch",
    time: "1-2 days",
    price: () => 1.99,

  },
  {
    id: "home",
    icon: FaHome,
    name: "Home delivery",
    subtitle: "Delivered to your door",
    time: "1-2 days",
    price: () => 1.99,
    badge: "Popular",
  },
  {
    id: "pickup",
    icon: FaBox,
    name: "Pick up at store",
    subtitle: "Pick up at your nearest store",
    time: "Ready in 2 hours",
    price: () => 0,
    badge: null,
  },
];

// Each payment method uses a real logo image URL; card uses inline SI icons
const PAYMENT_METHODS = [
  {
    id: "khqr",
    label: "KHQR",
    logo: "/payment/khqr.png",
  },
  {
    id: "aba",
    label: "ABA",
    logo: "/payment/aba.png",
  },
  {
    id: "aceleda",
    label: "Aceleda",
    logo: "/payment/aceleda.png",
  },
  {
    id: "wing",
    label: "Wing",
    logo: "/payment/wing.png",
  },
];



// ── Main component ─────────────────────────────────────────────────────────────
export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const {
    cart,
    cartTotal,
    clearCart,
    updateQuantity,
    removeFromCart,
    addOrder,
    orders,
    t,
  } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(() => {
    try {
      const saved = sessionStorage.getItem("kbs_checkout_step");
      if (saved && ["cart", "address", "shipping", "payment", "confirmation"].includes(saved)) {
        return saved as Step;
      }
    } catch {}
    return "cart";
  });
  const [processing, setProcessing] = useState(false);
  const [orderDone, setOrderDone] = useState(() => {
    try {
      return sessionStorage.getItem("kbs_checkout_step") === "confirmation";
    } catch {
      return false;
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const [address, setAddress] = useState(() => {
    try {
      const saved = sessionStorage.getItem("kbs_checkout_address");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "Cambodia",
      saveAddress: true,
      addressType: "home" as "home" | "work",
    };
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {},
  );

  const [shipMethod, setShipMethod] = useState(() => {
    try {
      return sessionStorage.getItem("kbs_checkout_ship") || "standard";
    } catch {
      return "standard";
    }
  });
  const [payMethod, setPayMethod] = useState(() => {
    try {
      const saved = sessionStorage.getItem("kbs_checkout_pay");
      if (saved && ["khqr", "aba", "aceleda", "wing"].includes(saved)) {
        return saved;
      }
    } catch {}
    return "khqr";
  });

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copiedId, setCopiedId] = useState(false);

  // Persist current step and form inputs to sessionStorage so refresh keeps user in checkout
  useEffect(() => {
    try {
      sessionStorage.setItem("kbs_checkout_step", step);
    } catch {}
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("kbs_checkout_address", JSON.stringify(address));
      } catch {}
    }, 400);
    return () => clearTimeout(timer);
  }, [address]);

  useEffect(() => {
    try {
      sessionStorage.setItem("kbs_checkout_ship", shipMethod);
    } catch {}
  }, [shipMethod]);

  useEffect(() => {
    try {
      sessionStorage.setItem("kbs_checkout_pay", payMethod);
    } catch {}
  }, [payMethod]);

  useEffect(() => {
    if (showQR && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showQR, timeLeft]);

  // Reset QR state when payment method changes
  useEffect(() => {
    setShowQR(false);
    setTimeLeft(600);
  }, [payMethod]);

  // ABA PayWay Integration State
  const [paywayLoading, setPaywayLoading] = useState(false);
  const [paywayTranId, setPaywayTranId] = useState<string | null>(null);
  const [paywayError, setPaywayError] = useState<string | null>(null);
  const [paywayModalOpen, setPaywayModalOpen] = useState(false);
  const [pollingTimer, setPollingTimer] = useState<any>(null);

  // KHQR (khqr.cc / ACLEDA / Wing / Bakong) Integration State
  const [khqrLoading, setKhqrLoading] = useState(false);
  const [khqrTranId, setKhqrTranId] = useState<string | null>(null);
  const [, setKhqrQrString] = useState<string | null>(null);
  const [khqrQrImage, setKhqrQrImage] = useState<string | null>(null);
  const [khqrError, setKhqrError] = useState<string | null>(null);
  const [khqrPollingTimer, setKhqrPollingTimer] = useState<any>(null);
  const [khqrBakongAcc] = useState<string>("010358062@abaa");
  const [khqrIsStatic] = useState<boolean>(false);
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setReceiptError("Please upload a valid image file (PNG, JPG, or JPEG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setReceiptError("Image size exceeds 8MB limit.");
      return;
    }
    setReceiptError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentReceipt(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      if (pollingTimer) clearInterval(pollingTimer);
      if (khqrPollingTimer) clearInterval(khqrPollingTimer);
    };
  }, [pollingTimer, khqrPollingTimer]);

  const [confirmedOrderId, setConfirmedOrderId] = useState<string>(() => {
    try {
      return sessionStorage.getItem("kbs_checkout_order_id") || "";
    } catch {
      return "";
    }
  });
  const [confirmedItems, setConfirmedItems] = useState<any[]>(() => {
    try {
      const s = sessionStorage.getItem("kbs_checkout_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });

  // Clean numeric order fallback
  const [orderNumber] = useState(() => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  });

  const [fixedDiscount, setFixedDiscount] = useState(0);
  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === shipMethod)!;
  const shippingCost = selectedShipping ? selectedShipping.price() : 0;
  const discountAmount = fixedDiscount > 0 ? fixedDiscount : cartTotal * promoDiscount;
  const giftCost = giftWrap ? 4.99 : 0;
  // Test Mode: Fixed to 0.10 USD (meets Cambodian bank minimum transaction limit)
  const total = 0.10;

  const deliveryDate = new Date();
  const daysToAdd =
    shipMethod === "overnight"
      ? 1
      : shipMethod === "express"
        ? 3
        : shipMethod === "pickup"
          ? 0
          : 7;
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

  const applyPromo = async () => {
    const code = promoInput.toUpperCase().trim();
    if (!code) return;
    try {
      const res = await fetch(`${API_BASE}/api/sales/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cart_total: cartTotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoCode(code);
        setFixedDiscount(data.discount_amount);
        setPromoDiscount(0);
        setPromoApplied(true);
        setPromoError("");
        return;
      }
    } catch {
      // Fallback
    }

    const rate = PROMO_CODES[code];
    if (rate) {
      setPromoCode(code);
      setPromoDiscount(rate);
      setFixedDiscount(0);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Ex: BOOKWORM15, READER20");
      setPromoApplied(false);
    }
  };
  const removePromo = () => {
    setPromoCode("");
    setPromoInput("");
    setPromoDiscount(0);
    setFixedDiscount(0);
    setPromoApplied(false);
    setPromoError("");
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.firstName.trim()) errs.firstName = "Required";
    if (!address.lastName.trim()) errs.lastName = "Required";
    if (
      !address.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)
    )
      errs.email = "Valid email required";
    if (!address.phone.trim()) errs.phone = "Required";
    if (!address.line1.trim()) errs.line1 = "Street address required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };



  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (step === "address" && !validateAddress()) return;
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const prevStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const startPayWayCheckout = async () => {
    setPaywayLoading(true);
    setPaywayError(null);
    try {
      const response = await fetch(`${API_BASE}/api/payway/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          firstname: address.firstName || "Customer",
          lastname: address.lastName || "KhmerBookstore",
          email: address.email || "customer@example.com",
          phone: address.phone || "012345678",
          payment_option: payMethod === "khqr" ? "abapay" : payMethod === "aba" ? "abapay" : "cards",
          shipping: shippingCost,
          items: cart.map((item) => ({
            book_id: item.id,
            name: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();
      if (data && data.params) {
        setPaywayTranId(data.tran_id);
        setPaywayModalOpen(true);

        // Remove existing form if any
        const existingForm = document.getElementById("aba_merchant_request");
        if (existingForm) existingForm.remove();

        // Submit form directly into our in-app embedded iframe to avoid browser COOP popup blocks
        setTimeout(() => {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.action_url;
          form.target = "payway_embedded_frame";
          form.id = "aba_merchant_request";
          form.name = "aba_merchant_request";
          form.style.display = "none";

          Object.entries(data.params).forEach(([key, val]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(val);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }, 150);

        // Start polling payment status from PayWay Sandbox backend
        if (pollingTimer) clearInterval(pollingTimer);
        const pollInterval = setInterval(async () => {
          try {
            const checkRes = await fetch(`${API_BASE}/api/payway/check-transaction/${data.tran_id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" }
            });
            const checkData = await checkRes.json();
            if (checkData.is_paid) {
              clearInterval(pollInterval);
              setPaywayModalOpen(false);
              const snapshot = [...cart];
              addOrder({
                id: data.tran_id,
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
                status: "Processing",
                statusColor: "bg-emerald-100 text-emerald-700",
                items: snapshot.map((i) => i.title),
                itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
                total: `$${total.toFixed(2)}`,
              });
              clearCart();
              setOrderDone(true);
              setStep("confirmation");
            }
          } catch {
            // continue polling
          }
        }, 3000);

        setPollingTimer(pollInterval);
      } else {
        setPaywayError("Could not initialize PayWay Sandbox transaction.");
      }
    } catch (err: any) {
      console.error("PayWay Checkout Error:", err);
      setPaywayError(err?.message || "Failed to reach PayWay API endpoint.");
    } finally {
      setPaywayLoading(false);
    }
  };

  const simulateSandboxApproval = async () => {
    setProcessing(true);
    const snapshot = [...cart];
    setConfirmedItems(snapshot);
    if (pollingTimer) clearInterval(pollingTimer);
    let resolvedId = "";

    try {
      const token = localStorage.getItem("frontend_token") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          total: total,
          payment_method: "aba",
          payment_status: "paid",
          tran_id: paywayTranId || `ABA-${Date.now()}`,
          estimated_delivery: "3-5 business days",
          items: snapshot.map((i) => ({
            book_id: i.id,
            quantity: i.quantity,
            selected_format: i.format || "Paperback",
            price: i.price,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) resolvedId = String(data.id);
      }
    } catch {}

    if (!resolvedId) resolvedId = orders.length > 0 ? String(orders.length + 101) : "29";
    setConfirmedOrderId(resolvedId);
    try {
      sessionStorage.setItem("kbs_checkout_order_id", resolvedId);
      sessionStorage.setItem("kbs_checkout_items", JSON.stringify(snapshot));
    } catch {}

    setTimeout(() => {
      addOrder({
        id: resolvedId,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Processing",
        statusColor: "bg-emerald-100 text-emerald-700",
        items: snapshot.map((i) => i.title),
        itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
        total: `$${total.toFixed(2)}`,
      });
      clearCart();
      setProcessing(false);
      setOrderDone(true);
      setStep("confirmation");
    }, 1200);
  };

  // ── KHQR (khqr.cc / ACLEDA / Wing) Handlers ──────────────────────────────
  const generateKhqr = async () => {
    setKhqrLoading(true);
    setKhqrError(null);
    try {
      const res = await fetch(`${API_BASE}/api/khqr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          firstname: address.firstName || "Customer",
          lastname: address.lastName || "KhmerBookstore",
          email: address.email || "customer@example.com",
          phone: address.phone || "012345678",
          payment_method: payMethod,
          shipping: shippingCost,
          bakong_account: khqrBakongAcc.trim(),
          static: khqrIsStatic,
          items: cart.map((item) => ({
            book_id: item.id,
            name: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();
      if (data && data.qr_image_url) {
        setKhqrTranId(data.tran_id);
        setKhqrQrString(data.qr_string);
        setKhqrQrImage(data.qr_image_url);
        setShowQR(true);
        setTimeLeft(data.expires_in || 600);

        // Start polling status from backend
        if (khqrPollingTimer) clearInterval(khqrPollingTimer);
        const poll = setInterval(async () => {
          try {
            const checkRes = await fetch(`${API_BASE}/api/khqr/check/${data.tran_id}`);
            const checkData = await checkRes.json();
            if (checkData.is_paid) {
              clearInterval(poll);
              const snapshot = [...cart];
              setConfirmedItems(snapshot);
              const resolvedId = String(orders.length > 0 ? orders.length + 101 : 29);
              setConfirmedOrderId(resolvedId);
              try {
                sessionStorage.setItem("kbs_checkout_order_id", resolvedId);
                sessionStorage.setItem("kbs_checkout_items", JSON.stringify(snapshot));
              } catch {}

              addOrder({
                id: resolvedId,
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
                status: "Processing",
                statusColor: "bg-emerald-100 text-emerald-700",
                items: snapshot.map((i) => i.title),
                itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
                total: `$${total.toFixed(2)}`,
              });
              clearCart();
              setOrderDone(true);
              setStep("confirmation");
            }
          } catch {
            // continue polling
          }
        }, 2500);
        setKhqrPollingTimer(poll);
      } else {
        setKhqrError("Could not generate dynamic KHQR code.");
      }
    } catch (err: any) {
      console.error("KHQR Generation Error:", err);
      setKhqrError(err?.message || "Failed to reach KHQR API endpoint.");
    } finally {
      setKhqrLoading(false);
    }
  };

  const simulateKhqrApproval = async () => {
    setProcessing(true);
    if (khqrTranId) {
      try {
        await fetch(`${API_BASE}/api/khqr/simulate-pay/${khqrTranId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      } catch {}
    }
    if (khqrPollingTimer) clearInterval(khqrPollingTimer);
    const snapshot = [...cart];
    setConfirmedItems(snapshot);
    let resolvedId = "";

    try {
      const token = localStorage.getItem("frontend_token") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          total: total,
          payment_method: payMethod,
          payment_status: "paid",
          tran_id: khqrTranId || `KHQR-${Date.now()}`,
          payment_receipt: paymentReceipt,
          estimated_delivery: "3-5 business days",
          items: snapshot.map((i) => ({
            book_id: i.id,
            quantity: i.quantity,
            selected_format: i.format || "Paperback",
            price: i.price,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) resolvedId = String(data.id);
      }
    } catch {}

    if (!resolvedId) resolvedId = orders.length > 0 ? String(orders.length + 101) : "101";
    setConfirmedOrderId(resolvedId);
    try {
      sessionStorage.setItem("kbs_checkout_order_id", resolvedId);
      sessionStorage.setItem("kbs_checkout_items", JSON.stringify(snapshot));
    } catch {}

    setTimeout(() => {
      addOrder({
        id: resolvedId,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Processing",
        statusColor: "bg-emerald-100 text-emerald-700",
        items: snapshot.map((i) => i.title),
        itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
        total: `$${total.toFixed(2)}`,
      });
      clearCart();
      setProcessing(false);
      setOrderDone(true);
      setStep("confirmation");
    }, 1200);
  };

  const placeOrder = async () => {
    if (payMethod === "aba") {
      startPayWayCheckout();
      return;
    }
    if (payMethod === "aceleda" || payMethod === "wing" || payMethod === "khqr") {
      setStep("payment");
      if (!khqrQrImage) {
        generateKhqr();
      }
      return;
    }
    setProcessing(true);
    const snapshot = [...cart];
    setConfirmedItems(snapshot);
    let resolvedId = "";

    try {
      const token = localStorage.getItem("frontend_token") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          total: total,
          payment_method: payMethod,
          payment_status: payMethod === "card" ? "paid" : "unpaid",
          tran_id: `KBS-${Date.now()}`,
          estimated_delivery: "3-5 business days",
          items: snapshot.map((i) => ({
            book_id: i.id,
            quantity: i.quantity,
            selected_format: i.format || "Paperback",
            price: i.price,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          resolvedId = String(data.id);
        }
      }
      localStorage.setItem("books_updated_at", Date.now().toString());
    } catch (err) {
      console.error("Failed to sync order to backend:", err);
    }

    if (!resolvedId) {
      resolvedId = orders.length > 0 ? String(orders.length + 101) : "101";
    }

    setConfirmedOrderId(resolvedId);
    try {
      sessionStorage.setItem("kbs_checkout_order_id", resolvedId);
      sessionStorage.setItem("kbs_checkout_items", JSON.stringify(snapshot));
    } catch {}

    setTimeout(() => {
      addOrder({
        id: resolvedId,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Processing",
        statusColor: "bg-emerald-100 text-emerald-700",
        items: snapshot.map((i) => i.title),
        itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
        total: `$${total.toFixed(2)}`,
      });
      clearCart();
      setProcessing(false);
      setOrderDone(true);
      setStep("confirmation");
    }, 1500);
  };

  const clearCheckoutSession = () => {
    try {
      sessionStorage.removeItem("bh_checkout_open");
      sessionStorage.removeItem("kbs_checkout_step");
      sessionStorage.removeItem("kbs_checkout_address");
      sessionStorage.removeItem("kbs_checkout_ship");
      sessionStorage.removeItem("kbs_checkout_pay");
      sessionStorage.removeItem("kbs_checkout_order_id");
      sessionStorage.removeItem("kbs_checkout_items");
    } catch {}
  };

  // ── Confirmation button handlers ──
  const handleContinueShopping = () => {
    clearCheckoutSession();
    setOrderDone(false);
    setStep("cart");
    onClose();
    navigate("/");
  };

  const handleTrackOrder = () => {
    const trackId = (confirmedOrderId || orderNumber).replace(/^#/, '');
    clearCheckoutSession();
    setOrderDone(false);
    setStep("cart");
    onClose();
    navigate(`/track-order?orderId=${encodeURIComponent(trackId)}`);
  };

  const handleModalClose = () => {
    if (!processing) {
      clearCheckoutSession();
      setOrderDone(false);
      setStep("cart");
      onClose();
      navigate("/");
    }
  };



  if (!isOpen) return null;

  // ── Order summary sidebar (Render function to keep DOM input focus) ──────
  const renderOrderSummary = (compact = false) => (
    <div
      className={`${compact ? "" : "lg:col-span-2 bg-emerald-50 dark:bg-white/5 border-l border-emerald-100 dark:border-white/5"} p-6`}
    >
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("orderSummary")}
      </h3>
      <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1 scrollbar-hide">
        {cart.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 bg-white dark:bg-dark-card rounded-xl p-3 shadow-sm border dark:border-white/5"
          >
            <div className="w-12 h-16 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-dark-bg rounded-lg p-1">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">
                {item.selectedFormat}
              </p>
              <p
                className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                {item.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                by {item.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("quantity")}: {item.quantity}
              </p>
            </div>
            <p className="font-black text-gray-900 dark:text-white text-sm flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {step !== "confirmation" && (
        <div className="mb-4">
          {promoApplied ? (
            <div className="flex items-center justify-between bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl px-4 py-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <FaTag className="text-emerald-700 dark:text-emerald-400" size={13} />
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  {promoCode}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  (-{(promoDiscount > 0 ? (promoDiscount * 100).toFixed(0) : 10)}%)
                </span>
              </div>
              <button
                type="button"
                onClick={removePromo}
                className="text-red-500 hover:text-red-700 dark:text-red-400 text-xs font-bold cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaTag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={12}
                  />
                  <input
                    type="text"
                    placeholder="Promotion  code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyPromo();
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl text-sm focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 dark:text-white transition-colors uppercase font-mono tracking-wider font-semibold placeholder:normal-case placeholder:font-sans placeholder:tracking-normal"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={!promoInput.trim()}
                  className="px-4 py-2.5 bg-emerald-900 dark:bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-800 dark:hover:bg-emerald-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle size={10} /> {promoError}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1.5">
                Try: BOOKWORM15, READER20, or SAVE10
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-emerald-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t("subtotal")} ({cart.reduce((s, i) => s + i.quantity, 0)}{" "}
            {t("items")})
          </span>
          <span className="font-semibold dark:text-white">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 flex items-center gap-1">
              <FaTag size={11} /> {t("promo")} ({promoCode})
            </span>
            <span className="text-emerald-600 font-bold">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {step !== "cart" && step !== "address" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {t("shipping")} ({selectedShipping?.name})
            </span>
            <span
              className={`font-semibold ${shippingCost === 0 ? "text-emerald-600" : "dark:text-white"}`}
            >
              {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
        )}
        {giftWrap && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaGift size={11} /> {t("giftWrap")}
            </span>
            <span className="font-semibold dark:text-white">$4.99</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-black pt-3 border-t border-emerald-200">
          <span className="dark:text-white">{t("total")}</span>
          <span className="text-emerald-900 dark:text-emerald-400">
            $
            {step === "cart" || step === "address"
              ? (cartTotal - discountAmount + giftCost).toFixed(2)
              : step === "shipping"
                ? (
                  cartTotal -
                  discountAmount +
                  shippingCost +
                  giftCost
                ).toFixed(2)
                : total.toFixed(2)}
          </span>
        </div>
      </div>

      {(step === "cart" || step === "address") && (
        <div className="mt-4 p-3 bg-white dark:bg-dark-card rounded-xl border border-emerald-200 dark:border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaGift className="text-emerald-600" /> Gift Wrap (+$4.99)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Premium wrapping with a personalized note
              </p>
            </div>
          </label>
          {giftWrap && (
            <textarea
              placeholder="Add a gift message (optional)"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              rows={2}
              className="mt-3 w-full px-3 py-2 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-bg rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-white resize-none"
            />
          )}
        </div>
      )}

    </div>
  );

  // ── Payment method selector with real logos ───────────────────────────────
  const renderPaymentSelector = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {PAYMENT_METHODS.map((pm) => {
        const isSelected = payMethod === pm.id;
        return (
          <label
            key={pm.id}
            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? "border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 shadow-xs" : "border-gray-200 dark:border-white/10 hover:border-gray-300"}`}
          >
            <input
              type="radio"
              name="paymethod"
              value={pm.id}
              checked={isSelected}
              onChange={() => setPayMethod(pm.id)}
              className="w-4 h-4 accent-emerald-700 flex-shrink-0"
            />
            <img
              src={pm.logo}
              alt={pm.label}
              className="h-6 w-auto object-contain max-w-[56px]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
              {pm.label}
            </span>
          </label>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      {/* ABA PayWay In-App Dialog Overlay (Bypasses Cross-Origin Popup Blocks) */}
      {paywayModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#18181b] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
              <div className="flex items-center gap-3">
                <img src="/payment/aba.png" alt="ABA" className="h-7 w-auto object-contain bg-white rounded-lg p-1" />
                <div>
                  <h3 className="font-bold text-base leading-tight">ABA PayWay Checkout</h3>
                  <p className="text-xs text-red-200">Sandbox Environment · Pay with ABA Mobile or Card</p>
                </div>
              </div>
              <button
                onClick={() => setPaywayModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Embedded PayWay Iframe */}
            <div className="flex-1 min-h-[560px] bg-gray-50 dark:bg-black/40 relative">
              <iframe
                name="payway_embedded_frame"
                id="payway_embedded_frame"
                className="w-full h-[560px] border-0"
                title="ABA PayWay Checkout"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-emerald-500" /> Auto-detecting payment...
              </span>
              <button
                onClick={simulateSandboxApproval}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-white/10 dark:hover:bg-white/20 text-emerald-900 dark:text-emerald-200 rounded-lg font-bold transition-all cursor-pointer"
              >
                Simulate Test Approval
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={
          orderDone
            ? undefined
            : () => {
              if (!processing) handleModalClose();
            }
        }
      />
      <div className="relative min-h-screen flex items-start justify-center p-3 py-6 md:p-6">
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden my-4 border dark:border-white/5">
          {!orderDone && (
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center text-gray-500 hover:rotate-90 transition-all cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          )}

          {/* Header + progress */}
          {!orderDone && (
            <div className="bg-emerald-800 px-6 pt-6 pb-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-16 rounded-2xl flex items-center justify-center">
                  <img
                    src="./logo.png"
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1
                    className="text-white font-black text-3xl"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    {t("khmerBookstoreCheckout")}
                  </h1>
                  <p className="text-emerald-200 text-sm">
                    {t("secureEncryptedCheckout")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {STEPS.filter((s) => s !== "confirmation").map((s, i) => {
                  const currentIdx = STEPS.indexOf(step);
                  const isActive = s === step;
                  const isDone = i < currentIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${isDone ? "bg-emerald-400 text-white shadow-lg" : isActive ? "bg-white text-emerald-900 shadow-lg scale-110" : "bg-white/20 text-white/60"}`}
                        >
                          {isDone ? <FaCheck size={12} /> : i + 1}
                        </div>
                        <span
                          className={`text-xs mt-1 font-semibold transition-all ${isActive ? "text-white" : isDone ? "text-emerald-300" : "text-white/40"}`}
                        >
                          {STEP_LABELS[i]}
                        </span>
                      </div>
                      {i <
                        STEPS.filter((s) => s !== "confirmation").length -
                        1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-all ${i < currentIdx ? "bg-emerald-400" : "bg-white/20"}`}
                          />
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CART ── */}
          {step === "cart" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-black text-gray-900 dark:text-white"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    {t("yourCart")}{" "}
                    <span className="text-emerald-700">
                      ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                  </h2>
                  {cartTotal < 35 && (
                    <div className="text-right">
                      <p className="text-xs text-emerald-700 font-semibold">
                        {t("addForFreeShipping").replace(
                          "{{amount}}",
                          (35 - cartTotal).toFixed(2),
                        )}
                      </p>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min((cartTotal / 35) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 text-emerald-600">
                      <BookOpen size={60} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t("cartEmpty")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {t("addBooksGetStarted")}
                    </p>
                    <button
                      onClick={handleModalClose}
                      className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all dark:hover:bg-emerald-600 cursor-pointer"
                    >
                      {t("browseBooks")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-gray-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-white/10 rounded-2xl p-4 transition-colors group"
                      >
                        <div className="w-20 h-28 flex-shrink-0 bg-white dark:bg-dark-bg rounded-xl p-2 shadow-sm flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-1">
                                {item.selectedFormat}
                              </span>
                              <h4
                                className="font-black text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug"
                                style={{ fontFamily: "Merriweather, serif" }}
                              >
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                by {item.author}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar
                                    key={j}
                                    size={10}
                                    className={
                                      j < Math.round(item.rating)
                                        ? "text-emerald-400"
                                        : "text-gray-200 dark:text-white/10"
                                    }
                                  />
                                ))}
                                <span className="text-xs text-gray-450 dark:text-gray-500">
                                  ({item.rating})
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.selectedFormat)
                              }
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <FaTimes size={13} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border-2 border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-dark-card overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedFormat,
                                    item.quantity - 1,
                                  )
                                }
                                className="px-3 py-2 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400 font-bold"
                              >
                                −
                              </button>
                              <span className="w-10 text-center text-sm font-black text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedFormat,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-3 py-2 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400 font-bold"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 dark:text-white text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500 dark:text-gray-450">
                                  ${item.price.toFixed(2)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {t("continueShopping")}
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={cart.length === 0}
                      className="flex-[2] py-4 bg-emerald-800 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-black text-lg flex items-center justify-center shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {t("proceedCheckout")}
                    </button>
                  </div>
                )}
              </div>
              {renderOrderSummary()}
            </div>
          )}

          {/* ── ADDRESS ── */}
          {step === "address" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-400 mb-6 text-sm font-semibold transition-colors"
                >
                  Back to Cart
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Shipping Address
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Where should we deliver your books?
                </p>
                <div className="flex gap-3 mb-6">
                  {[
                    { id: "home", icon: FaHome, label: "Home" },
                    { id: "work", icon: FaBuilding, label: "Work" },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() =>
                        setAddress({
                          ...address,
                          addressType: id as "home" | "work",
                        })
                      }
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${address.addressType === id ? "border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 cursor-pointer"}`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <FaUser
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="text"
                        placeholder="Hak"
                        value={address.firstName}
                        onChange={(e) => {
                          setAddress({ ...address, firstName: e.target.value });
                          setAddressErrors({ ...addressErrors, firstName: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.firstName ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                      />
                    </div>
                    {addressErrors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Hai"
                      value={address.lastName}
                      onChange={(e) => {
                        setAddress({ ...address, lastName: e.target.value });
                        setAddressErrors({ ...addressErrors, lastName: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.lastName ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                    />
                    {addressErrors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="email"
                        placeholder="hai123@email.com"
                        value={address.email}
                        onChange={(e) => {
                          setAddress({ ...address, email: e.target.value });
                          setAddressErrors({ ...addressErrors, email: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.email ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                      />
                    </div>
                    {addressErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="tel"
                        placeholder="+885 555 000-0000"
                        value={address.phone}
                        onChange={(e) => {
                          setAddress({ ...address, phone: e.target.value });
                          setAddressErrors({ ...addressErrors, phone: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.phone ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                      />
                    </div>
                    {addressErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                       Address *
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="text"
                        placeholder="Ce Pe Ce, Teuk Thla"
                        value={address.line1}
                        onChange={(e) => {
                          setAddress({ ...address, line1: e.target.value });
                          setAddressErrors({ ...addressErrors, line1: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.line1 ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                      />
                    </div>
                    {addressErrors.line1 && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.line1}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Apartment, Suite, etc.{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <FaBuilding
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="text"
                        placeholder="Borey Peng Huoth"
                        value={address.line2}
                        onChange={(e) =>
                          setAddress({ ...address, line2: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:outline-none bg-white dark:bg-dark-card focus:border-emerald-500 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                       District *
                    </label>
                    <input
                      type="text"
                      placeholder="Sen Sok"
                      value={address.city}
                      onChange={(e) => {
                        setAddress({ ...address, city: e.target.value });
                        setAddressErrors({ ...addressErrors, city: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.city ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                    />
                    {addressErrors.city && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      placeholder="Phnom Penh"
                      value={address.state}
                      onChange={(e) => {
                        setAddress({ ...address, state: e.target.value });
                        setAddressErrors({ ...addressErrors, state: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.state ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                    />
                    {addressErrors.state && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors appearance-none bg-white dark:bg-dark-card dark:text-white cursor-pointer"
                    >
                      {[
                        "Cambodia",
                        "United States",
                        "Canada",
                        "China",
                        "United Kingdom",
                        "Australia",
                        "Germany",
                        "France",
                        "Spain",
                        "Italy",
                        "Netherlands",
                        "Japan",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 mt-5 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <input
                    type="checkbox"
                    checked={address.saveAddress}
                    onChange={(e) =>
                      setAddress({ ...address, saveAddress: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Save this address for future orders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      We'll securely store your address for faster checkout next
                      time
                    </p>
                  </div>
                </label>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-black flex items-center justify-center shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
              {renderOrderSummary()}
            </div>
          )}

          {/* ── SHIPPING ── */}
          {step === "shipping" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-emerald-800 mb-6 text-sm font-semibold transition-colors"
                >
                  Back to Address
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Shipping Method
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Choose how fast you want your books delivered
                </p>
                <div className="bg-emerald-50 dark:bg-white/5 rounded-2xl p-4 mb-6 flex items-start gap-3 border border-emerald-100 dark:border-white/5">
                  <FaMapMarkerAlt
                    className="text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.country}</p>
                  </div>
                  <button
                    onClick={() => setStep("address")}
                    className="text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:underline flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const cost = method.price();
                    const isSelected = shipMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? "border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 shadow-md" : "border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-white/20 hover:bg-emerald-50/30"}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setShipMethod(method.id)}
                          className="w-5 h-5 accent-emerald-700"
                        />
                        <Icon
                          size={24}
                          className="text-emerald-700 dark:text-emerald-400 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {method.name}
                            </p>
                            {method.badge && (
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${method.badge === "Popular" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : method.badge === "Fastest" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"}`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {method.subtitle}
                          </p>
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <FaCalendarAlt size={11} /> {method.time}
                          </p>
                        </div>
                        <span
                          className={`text-lg font-black flex-shrink-0 ${cost === 0 ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}
                        >
                          {cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-6 bg-blue-50 rounded-2xl p-4 flex items-center gap-3"></div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-black flex items-center justify-center shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
              {renderOrderSummary()}
            </div>
          )}

          {/* ── PAYMENT ── */}
          {step === "payment" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-emerald-800 mb-6 text-sm font-semibold transition-colors"
                >
                  Back to Shipping
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Payment
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  All transactions are secure and encrypted
                </p>

                {/* Payment method selector */}
                {renderPaymentSelector()}

                {/* ABA PayWay Interactive Sandbox Panel */}
                {payMethod === "aba" && (
                  <div className="space-y-4 mt-6">
                    <div className="p-5 bg-emerald-900 dark:from-red-950/20 dark:to-emerald-950/20 rounded-3xl border border-red-200 dark:border-red-900/40">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <img src="/payment/aba.png" alt="ABA" className="h-6 w-auto object-contain" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            ABA PayWay Sandbox
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1">
                          <ShieldCheck size={13} /> Sandbox Active
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Pay securely with your ABA Mobile app, KHQR scan, or Visa/Mastercard test card in the sandbox environment.
                      </p>

                      {paywayError && (
                        <div className="p-3 mb-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl font-medium">
                          {paywayError}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <button
                          onClick={startPayWayCheckout}
                          disabled={paywayLoading}
                          className="w-full py-3.5 px-4 bg-emerald-600 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-sm shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-75"
                        >
                          {paywayLoading ? (
                            <>
                              <FaSpinner className="animate-spin" size={15} /> Launching ABA...
                            </>
                          ) : (
                            <>
                              <ExternalLink size={15} /> Open ABA PayWay Modal
                            </>
                          )}
                        </button>

                        <button
                          onClick={simulateSandboxApproval}
                          disabled={processing}
                          className="w-full py-3.5 px-4 bg-emerald-100 hover:bg-emerald-200 dark:bg-white/10 dark:hover:bg-white/20 text-emerald-900 dark:text-emerald-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                        >
                          {processing ? (
                            <>
                              <FaSpinner className="animate-spin" size={15} /> Simulating...
                            </>
                          ) : (
                            "Simulate Test Approval"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* KHQR / ACLEDA / Wing Dynamic Payment Panel */}
                {(payMethod === "aceleda" || payMethod === "wing" || payMethod === "khqr") && (
                  <div className="space-y-4 mt-6 animate-fadeIn">
                    <div className="rounded-3xl border border-emerald-900/30 dark:border-emerald-500/20 bg-emerald-950/90 dark:bg-dark-card p-5 relative overflow-hidden shadow-xl">
                      {/* Top status bar */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              payMethod === "aceleda"
                                ? "/payment/aceleda.png"
                                : payMethod === "wing"
                                ? "/payment/wing.png"
                                : "/payment/khqr.png"
                            }
                            alt={payMethod}
                            className="h-8 w-auto object-contain bg-white dark:bg-white/10 rounded-xl p-1.5 border border-white/20 shadow-xs"
                          />
                          <div>
                            <span className="font-black text-white text-sm block tracking-tight">
                              {payMethod === "aceleda"
                                ? "ACLEDA KHQR Payment"
                                : payMethod === "wing"
                                ? "Wing Bank KHQR"
                                : "Universal Bakong KHQR"}
                            </span>
                            <span className="text-[11px] text-emerald-200/90 dark:text-gray-300 font-medium">
                              Scannable with ACLEDA Mobile, ABA Mobile, Wing, or ANY Bakong App
                            </span>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center gap-1.5">
                          <QrCode size={13} /> NBC Bakong Live
                        </span>
                      </div>

                      {khqrError && (
                        <div className="p-3 mb-3 bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl font-medium">
                          {khqrError}
                        </div>
                      )}

                      {/* Not generated yet view */}
                      {!showQR && !khqrQrImage && (
                        <div className="flex flex-col items-center justify-center py-8 px-4 bg-white/10 dark:bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-xs">
                          <p className="text-white dark:text-gray-200 text-sm mb-4 max-w-md leading-relaxed font-medium">
                            Click below to generate a live Bakong KHQR code for{" "}
                            <span className="font-black text-emerald-300 font-mono text-base">${total.toFixed(2)} USD</span>.
                          </p>
                          <button
                            onClick={generateKhqr}
                            disabled={khqrLoading}
                            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-75"
                          >
                            {khqrLoading ? (
                              <>
                                <FaSpinner className="animate-spin" size={15} /> Generating KHQR...
                              </>
                            ) : (
                              <>
                                <QrCode size={16} /> Generate KHQR ($0.10 USD)
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* QR Display Card */}
                      {(showQR || khqrQrImage) && (
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-dark-bg rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative border border-gray-100 dark:border-white/10 shadow-md">
                            {/* Expiry / Countdown Timer */}
                            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10 text-xs">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                Transaction ID: <strong className="font-mono text-gray-900 dark:text-white">{khqrTranId || "KHQR..."}</strong>
                              </span>
                              <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-emerald-700 dark:text-emerald-400"}`}>
                                Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                              </span>
                            </div>

                            {timeLeft === 0 && (
                              <div className="absolute inset-0 z-10 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                                <p className="text-lg font-black text-red-600 mb-1">QR Code Expired</p>
                                <p className="text-xs text-gray-500 mb-4">Please generate a new KHQR code to complete your payment.</p>
                                <button
                                  onClick={generateKhqr}
                                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                                >
                                  Generate New QR
                                </button>
                              </div>
                            )}

                            {/* QR Code Container — Styled NBC Bakong Card */}
                            <div className={`w-72 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col items-center transition-opacity duration-500 ${timeLeft === 0 ? "opacity-20" : "opacity-100"}`}>
                              {/* Red Bakong Header */}
                              <div className="w-full bg-[#E1251B] py-2.5 px-4 flex items-center justify-between text-white">
                                <span className="text-sm font-black tracking-wider">KHQR</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Bakong</span>
                              </div>
                              
                              {/* Recipient Name & Amount */}
                              <div className="w-full pt-3 pb-1 px-4 text-center border-b border-dashed border-gray-200">
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">SOPHANUT HOEUN</p>
                                <p className="text-base font-black text-emerald-700 font-mono mt-0.5">${total.toFixed(2)} USD</p>
                              </div>

                              {/* Crisp QR Code Image */}
                              <div className="p-4 bg-white flex items-center justify-center">
                                <img
                                  src={khqrQrImage || "/qr.png"}
                                  alt="Bakong KHQR Code"
                                  className="w-52 h-52 object-contain"
                                />
                              </div>
                            </div>

                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Amount to pay: <span className="text-emerald-700 dark:text-emerald-400 font-black font-mono text-base">${total.toFixed(2)} USD</span>
                            </p>
                          </div>

                          {/* Payment Receipt / Screenshot Upload Section */}
                          <div className="bg-white/10 dark:bg-white/5 rounded-2xl p-4 border border-white/15 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                                
                                Upload Payment Receipt Screenshot <span className="text-red-400">*</span>
                              </label>
                              {paymentReceipt && (
                                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Receipt Attached
                                </span>
                              )}
                            </div>

                            {!paymentReceipt ? (
                              <label className="border-2 border-dashed border-white/20 hover:border-emerald-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-black/10 hover:bg-white/5 transition-all text-center">
                                <Upload className="w-6 h-6 text-emerald-300 animate-bounce" />
                                <div>
                                  <span className="text-xs font-bold text-white block">
                                    Click here to upload payment slip / screenshot
                                  </span>
                                  <span className="text-[10px] text-emerald-200/70">PNG, JPG, or JPEG (Max 8MB)</span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleReceiptUpload}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <div className="relative border border-emerald-500/40 rounded-xl p-3 bg-emerald-950/40 flex items-center gap-3">
                                <img
                                  src={paymentReceipt}
                                  alt="Payment receipt preview"
                                  className="w-14 h-14 object-cover rounded-lg border border-emerald-400 bg-white"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-white truncate">Payment Slip Attached</p>
                                  <p className="text-[11px] text-emerald-300 font-medium">Ready to submit for verification</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPaymentReceipt(null)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title="Remove receipt"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}

                            {receiptError && (
                              <p className="text-[11px] text-red-300 font-medium">{receiptError}</p>
                            )}
                          </div>

                          {/* I Have Paid Confirmation Button (Disabled if no receipt uploaded) */}
                          <div className="space-y-2">
                            <button
                              onClick={simulateKhqrApproval}
                              disabled={processing || !paymentReceipt}
                              className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                                paymentReceipt
                                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50 cursor-pointer active:scale-98"
                                  : "bg-white/10 text-gray-400 cursor-not-allowed opacity-60 border border-white/10"
                              }`}
                            >
                              {processing ? (
                                <>
                                  <FaSpinner className="animate-spin" size={16} /> Confirming Order...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={18} /> I Have Paid — Confirm Order
                                </>
                              )}
                            </button>

                            {!paymentReceipt && (
                              <p className="text-center text-[11px] text-emerald-200/70 font-medium">
                                ⚠️ Please upload your bank payment screenshot above to enable confirmation.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-black flex items-center justify-center shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
                  >
                    Review Order
                  </button>
                </div>
              </div>
              {renderOrderSummary()}
            </div>
          )}

          {/* ── REVIEW ── */}
          {step === "review" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-800 dark:hover:text-emerald-400 mb-6 text-sm font-semibold transition-colors"
                >
                  {t("backToPayment")}
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  {t("reviewOrder")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {t("confirmDetails")}
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaMapMarkerAlt className="text-emerald-700 dark:text-emerald-400" /> Delivery
                        Address
                      </h3>
                      <button
                        onClick={() => setStep("address")}
                        className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 font-semibold">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {address.city}, {address.state} {address.zip},{" "}
                      {address.country}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {address.email} · {address.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaTruck className="text-emerald-700 dark:text-emerald-400" /> Shipping Method
                      </h3>
                      <button
                        onClick={() => setStep("shipping")}
                        className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {selectedShipping?.name}
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                          {selectedShipping?.time}
                        </p>
                        {shipMethod !== "pickup" && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Estimated:{" "}
                            {deliveryDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <span
                        className={`font-black text-lg ${shippingCost === 0 ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}
                      >
                        {shippingCost === 0
                          ? "FREE"
                          : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCreditCard className="text-emerald-700 dark:text-emerald-400" /> Payment
                      </h3>
                      <button
                        onClick={() => setStep("payment")}
                        className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          PAYMENT_METHODS.find((m) => m.id === payMethod)
                            ?.logo ?? ""
                        }
                        alt={
                          PAYMENT_METHODS.find((m) => m.id === payMethod)
                            ?.label
                        }
                        className="h-7 w-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {
                            PAYMENT_METHODS.find((m) => m.id === payMethod)
                              ?.label
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <FaBox className="text-emerald-700 dark:text-emerald-400" /> Items (
                      {cart.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    <div className="space-y-3">
                      {cart.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className="w-10 h-14 flex-shrink-0 bg-white dark:bg-dark-card rounded-lg p-1 shadow-sm flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1"
                              style={{ fontFamily: "Merriweather, serif" }}
                            >
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.selectedFormat} · Quantity {item.quantity}
                            </p>
                          </div>
                          <p className="font-black text-gray-900 dark:text-white text-sm flex-shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/30">
                    <h3 className="font-black text-gray-900 dark:text-white mb-3">
                      Price Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span className="font-semibold dark:text-white">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Promo ({promoCode})</span>
                          <span className="font-bold">
                            -${discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                        <span
                          className={`font-semibold ${shippingCost === 0 ? "text-emerald-600 dark:text-emerald-400" : "dark:text-white"}`}
                        >
                          {shippingCost === 0
                            ? "FREE"
                            : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      {giftWrap && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Gift Wrap</span>
                          <span className="font-semibold dark:text-white">$4.99</span>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-black pt-2 border-t border-emerald-200 dark:border-emerald-900/30">
                        <span className="dark:text-white">Total Charged</span>
                        <span className="text-emerald-900 dark:text-emerald-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={placeOrder}
                    disabled={processing}
                    className="w-full py-5 bg-emerald-600 hover:from-emerald-700 hover:to-emerald-500 disabled:opacity-70 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-900/30 group cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="animate-spin" size={20} />{" "}
                        Processing Your Order...
                      </>
                    ) : (
                      `Place Order · $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
              {renderOrderSummary()}
            </div>
          )}

          {/* ── CONFIRMATION ── */}
          {step === "confirmation" && orderDone && (
            <div className="p-6 md:p-12 text-center max-w-2xl mx-auto">
              {/* Centered Green Circle Checkmark Icon */}
              <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#22c55e] bg-white dark:bg-dark-card flex items-center justify-center shadow-lg mb-5 animate-scaleUp">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-[#22c55e]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                {/* Centered Order Confirmed ! Text */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center">
                  Order Confirmed !
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2 max-w-md mx-auto text-center">
                  {t("booksOnWay").replace("{{name}}", address.firstName || "valued customer")}
                </p>
              </div>


              {/* Order Tracking ID Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Your Order Tracking ID
                  </span>
                  <span className="font-mono font-black text-2xl text-emerald-950 dark:text-emerald-200 mt-0.5 block">
                    #{(confirmedOrderId || orderNumber).replace(/^#/, '')}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Save this Order ID to track fulfillment and delivery anytime on our Track Order page.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText((confirmedOrderId || orderNumber).replace(/^#/, ''));
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-white dark:bg-dark-card border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-white/10 text-emerald-900 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    {copiedId ? <FaCheck size={13} className="text-emerald-500" /> : <FaCopy size={13} />}
                    <span>{copiedId ? "Copied ID!" : "Copy Order ID"}</span>
                  </button>
                </div>
              </div>

              {/* Invoice Section */}
              <div className="print-invoice bg-white dark:bg-dark-card rounded-3xl p-8 mb-8 text-left shadow-lg border border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Khmer Bookstore" className="h-12 w-12 object-contain" />
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1" style={{ fontFamily: "Merriweather, serif" }}>
                        INVOICE
                      </h3>
                      <p className="text-sm font-mono font-bold text-emerald-800 dark:text-emerald-300">
                        #{(confirmedOrderId || orderNumber).replace(/^#/, '')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold transition-colors cursor-pointer print:hidden"
                  >
                    Print
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
                    <p className="font-bold text-gray-900 dark:text-white">{address.firstName} {address.lastName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Date</p>
                    <p className="font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-8 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b-2 border-gray-100 dark:border-white/10">
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Qty</th>
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {(confirmedItems.length > 0 ? confirmedItems : cart).map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.author || item.selectedFormat || "Paperback Edition"}</p>
                          </td>
                          <td className="py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                        <span>Discount</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-4 border-t-2 border-gray-100 dark:border-white/10 mt-2">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-emerald-800 dark:text-emerald-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-8 text-left">
                <FaEnvelope
                  className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                    {t("confirmationEmail")}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    {t("sentOrderDetails")} <strong>{address.email}</strong>
                  </p>
                </div>
              </div>

              {/* ── Action buttons — navigate to real pages ── */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 py-4 bg-emerald-800 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-black transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                   {t("continueShopping")}
                </button>
                <button
                  onClick={handleTrackOrder}
                  className="flex-1 py-4 border-2 border-emerald-800 dark:border-emerald-400 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                   {t("trackOrder")}
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
                {t("needHelp")}{" "}
                <a
                  href="mailto:support@KhmerBookStore.com"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  support@KhmerBookStore.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

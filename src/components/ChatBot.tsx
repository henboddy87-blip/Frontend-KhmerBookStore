import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  User,
  RotateCcw,
  BookOpen,
  ShoppingBag,
  Tag,
  Star,
  Check,
  Copy,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Book } from "../types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  recommendations?: any[];
  sources?: string[];
}

interface SuggestionChip {
  label: string;
  query: string;
}

interface ChatBotProps {
  onOpenBookDetail?: (book: Book) => void;
}

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  loading: boolean;
  language: string;
}

function ChatInputBar({ onSendMessage, loading, language }: ChatInputBarProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const newHeight = Math.min(Math.max(el.scrollHeight, 24), 140);
      el.style.height = `${newHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-[#131722] border-t border-gray-200/80 dark:border-white/10 flex items-end gap-2.5 shrink-0">
      <div className="flex-1 bg-gray-100/90 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all p-2 flex items-end gap-1.5 shadow-2xs">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "km"
              ? "សួរ Fei អំពីសៀវភៅ ឬប្រូម៉ូសិន..."
              : "Ask Fei about books, deals, or details..."
          }
          rows={1}
          className="w-full resize-none bg-transparent px-3 py-1.5 text-sm sm:text-[15px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none max-h-36 leading-relaxed font-medium transition-all"
        />
        {text.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setText("");
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.focus();
              }
            }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors cursor-pointer shrink-0 mb-1"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || loading}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-md shrink-0 cursor-pointer ${
          text.trim() && !loading
            ? "bg-emerald-800 hover:bg-emerald-700 hover:scale-105 active:scale-95 shadow-emerald-900/20"
            : "bg-gray-300 dark:bg-white/10 text-gray-400 cursor-not-allowed"
        }`}
        title="Send Message"
      >
        <Send className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

export function ChatBot({ onOpenBookDetail }: ChatBotProps) {
  const { language, addToCart, books, user, setLanguage, token } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [suggestions, setSuggestions] = useState<SuggestionChip[]>([]);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);

  const isKhmer = language === "km";
  const defaultWelcomeMessage = isKhmer
    ? "ជំរាបសួរ! ខ្ញុំឈ្មោះ **Fei** ជាជំនួយការ AI របស់ Khmer Bookstore\n\nខ្ញុំអាចជួយអ្នកស្វែងរកសៀវភៅ (វិទ្យាសាស្ត្រ, ហិរញ្ញវត្ថុ, ប្រលោមលោក, អភិវឌ្ឍខ្លួន), ណែនាំប្រូម៉ូសិនបញ្ចុះតម្លៃ, Flash Sales, ឬកូដ Voucher! តើអ្នកចង់ដឹងអ្វីខ្លះថ្ងៃនេះ?"
    : "Hello! I'm **Fei**, your AI Librarian & Book Consultant at Khmer Bookstore\n\nI can help you discover science & finance books, literature, explore active flash sales & voucher promo codes, or answer store questions. How may I help you today?";

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem("kbs_chat_history_fei_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        const clean = parsed.filter(
          (m: ChatMessage) => !m.content.includes("momentary connection blip") && !m.content.includes("សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹក")
        );
        if (clean.length > 0) return clean;
      }
    } catch {}

    return [
      {
        id: "welcome",
        role: "assistant",
        content: defaultWelcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLDivElement>(null);
  const latestUserRef = useRef<HTMLDivElement>(null);

  // Auto scroll behavior: stay at top of new assistant response, or bottom when user types
  useEffect(() => {
    if (!isOpen) return;

    setHasUnread(false);
    setShowTooltip(false);

    if (loading) {
      // While thinking, scroll down so typing animation is in view
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    if (lastMsg.role === "assistant" && messages.length > 1) {
      // Stay at the TOP of the new assistant response so user reads from the beginning
      setTimeout(() => {
        if (latestAssistantRef.current && chatFeedRef.current) {
          const containerRect = chatFeedRef.current.getBoundingClientRect();
          const targetRect = latestAssistantRef.current.getBoundingClientRect();
          const offsetTop = targetRect.top - containerRect.top + chatFeedRef.current.scrollTop - 12;
          
          chatFeedRef.current.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: "smooth",
          });
        } else {
          latestAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    } else if (lastMsg.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Persist conversation to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("kbs_chat_history_fei_v4", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Fetch quick suggestion chips from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      const hosts = [
        window.location.hostname ? `http://${window.location.hostname}:8000` : null,
        "http://localhost:8000",
        "http://127.0.0.1:8000",
      ].filter(Boolean);

      for (const base of hosts) {
        try {
          const res = await fetch(`${base}/api/chat/suggestions?lang=${language}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
            return;
          }
        } catch {}
      }

      setSuggestions(
        language === "km"
          ? [
              { label: "សៀវភៅវិទ្យាសាស្ត្រ", query: "តើមានសៀវភៅវិទ្យាសាស្ត្រ (Science) អ្វីខ្លះដែលគួរអាន?" },
              { label: "ហិរញ្ញវត្ថុ & អាជីវកម្ម", query: "ណែនាំសៀវភៅហិរញ្ញវត្ថុ និងអាជីវកម្មល្អៗ" },
              { label: "Flash Sales & Deals", query: "តើថ្ងៃនេះមានការបញ្ចុះតម្លៃ ឬ Flash Sale អ្វីខ្លះ?" },
              { label: "កូដ Voucher", query: "តើមានកូដបញ្ចុះតម្លៃ (Promo Codes) អ្វីខ្លះ?" },
            ]
          : [
              { label: "Book Search", query: "Can you recommend a good book for a programming beginner?" },
              { label: "Finance & Wealth", query: "Recommend some of the best books in finance, wealth, and investing" },
              { label: "Active Deals", query: "What discount campaigns and flash sales are live today?" },
              { label: "Order Status", query: "Where is my order?" },
              { label: "Shipping Info", query: "How much does shipping cost?" },
            ]
      );
    };
    fetchSuggestions();
  }, [language]);

  const handleSendMessage = async (textToSend: string) => {
    const text = (textToSend || "").trim();
    if (!text || loading) return;

    // Check if user is asking to switch to Khmer
    const qLower = text.toLowerCase();
    const wantsKhmer = qLower.includes("khmer") || qLower.includes("ខ្មែរ") || qLower.includes("cambodian");
    const activeLang = wantsKhmer ? "km" : language;
    if (wantsKhmer && language !== "km") {
      setLanguage("km");
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const historyPayload = messages
      .filter((m) => m.id !== "welcome" && !m.content.includes("momentary connection blip"))
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    const payload = {
      message: text,
      history: historyPayload,
      language: activeLang,
    };

    const targetHosts = [
      window.location.hostname ? `http://${window.location.hostname}:8000` : null,
      "http://localhost:8000",
      "http://127.0.0.1:8000",
    ].filter(Boolean) as string[];

    let success = false;

    let headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    for (const base of targetHosts) {
      try {
        const res = await fetch(`${base}/api/chat`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            recommendations: data.recommendations || [],
            sources: data.sources || [],
          };

          setMessages((prev) => [...prev, botMsg]);
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`Attempt with ${base} failed, trying next...`, e);
      }
    }

    if (!success) {
      // Local smart response fallback
      let smartFallback = "";
      if (wantsKhmer || qLower.includes("speak khmer") || qLower.includes("respond in khmer")) {
        smartFallback =
          "បាទ/ចាស! ខ្ញុំអាចនិយាយ និងឆ្លើយតបជាភាសាខ្មែរបានយ៉ាងស្ទាត់ជំនាញ 🇰🇭✨\n\nខ្ញុំឈ្មោះ **Fei** ជា AI Librarian របស់ Khmer Bookstore។ ខ្ញុំអាចជួយលោកអ្នកស្វែងរកសៀវភៅល្អៗ ពិនិត្យតម្លៃ និងប្រាប់អំពីប្រូម៉ូសិនបញ្ចុះតម្លៃទាំងអស់។ តើលោកអ្នកចង់ឱ្យខ្ញុំជួយណែនាំសៀវភៅប្រភេទណាដែរ?";
      } else if (qLower.includes("sale") || qLower.includes("discount") || qLower.includes("promo") || qLower.includes("code") || qLower.includes("deal")) {
        smartFallback =
          activeLang === "km"
            ? "បច្ចុប្បន្នយើងមានប្រូម៉ូសិនពិសេស:\n• កូដ **`BOOKWORM15`** — បញ្ចុះតម្លៃ **15%**\n• កូដ **`READER20`** — បញ្ចុះតម្លៃ **20%** លើការទិញចាប់ពី $40\n• ការបញ្ចុះតម្លៃរហូតដល់ **40%** លើសៀវភៅ Bestsellers!\n\nអ្នកអាចបញ្ចូលកូដទាំងនេះនៅត្រង់ទំព័រទូទាត់បានភ្លាមៗ!"
            : "Here are active deals and voucher codes available today:\n• **`BOOKWORM15`** — 15% OFF your order\n• **`READER20`** — 20% OFF on orders over $40\n• Up to **40% OFF** on featured Bestsellers and Science books!\n\nYou can enter these codes at checkout or tap any book deal below.";
      } else if (qLower.includes("finance") || qLower.includes("money") || qLower.includes("invest") || qLower.includes("business")) {
        smartFallback =
          activeLang === "km"
            ? "សម្រាប់សៀវភៅហិរញ្ញវត្ថុ និងអាជីវកម្ម យើងសូមណែនាំ:\n• **The Psychology of Money** ដោយ Morgan Housel\n• **Rich Dad Poor Dad** ដោយ Robert Kiyosaki\n• **Atomic Habits** ដោយ James Clear\n\nតើអ្នកចង់មើលព័ត៌មានលម្អិតនៃសៀវភៅមួយណាដែរ?"
            : "For Finance & Wealth creation, here are top recommended books in our catalog:\n• **The Psychology of Money** by Morgan Housel\n• **Rich Dad Poor Dad** by Robert Kiyosaki\n• **Atomic Habits** by James Clear\n• **Think and Grow Rich** by Napoleon Hill\n\nFeel free to ask for summaries or tap any recommendation below!";
      } else if (qLower.includes("science") || qLower.includes("physics") || qLower.includes("space") || qLower.includes("sci")) {
        smartFallback =
          activeLang === "km"
            ? "សៀវភៅវិទ្យាសាស្ត្រល្បីៗនៅក្នុងហាង:\n• **A Brief History of Time** ដោយ Stephen Hawking\n• **Cosmos** ដោយ Carl Sagan\n• **Sapiens: A Brief History of Humankind** ដោយ Yuval Noah Harari\n\nតើអ្នកចង់ដឹងអំពីប្រធានបទវិទ្យាសាស្ត្រជាក់លាក់ណាមួយទេ?"
            : "Top Science & Astronomy books in our catalog:\n• **A Brief History of Time** by Stephen Hawking\n• **Cosmos** by Carl Sagan\n• **Sapiens: A Brief History of Humankind** by Yuval Noah Harari\n• **Astrophysics for People in a Hurry** by Neil deGrasse Tyson\n\nWould you like a chapter overview on any of these titles?";
      } else {
        smartFallback =
          activeLang === "km"
            ? "សួស្តី! ខ្ញុំឈ្មោះ Fei ជាជំនួយការ AI របស់ Khmer Bookstore។ ខ្ញុំអាចជួយលោកអ្នកស្វែងរកសៀវភៅវិទ្យាសាស្ត្រ ហិរញ្ញវត្ថុ ប្រលោមលោក អភិវឌ្ឍខ្លួន ឬប្រាប់អំពីប្រូម៉ូសិនបញ្ចុះតម្លៃ និងការដឹកជញ្ជូន។ តើមានអ្វីដែលខ្ញុំអាចជួយបានទេ?"
            : "Hello! I'm Fei, your AI Book Consultant at Khmer Bookstore. I can recommend books across Science, Finance, Self-Development, Fiction, or share our latest discounts and delivery details. What topic would you like to explore?";
      }

      const botFallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: smartFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botFallbackMsg]);
    }

    setLoading(false);
    if (!isOpen) setHasUnread(true);
  };


  const handleClearChat = () => {
    const initialWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: defaultWelcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([initialWelcome]);
    sessionStorage.removeItem("kbs_chat_history_fei_v4");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddToCartFromChat = (recBook: any) => {
    const matched: Book = books.find((b) => b.id === recBook.id) || {
      id: recBook.id,
      title: recBook.title,
      author: recBook.author,
      price: recBook.price,
      originalPrice: recBook.original_price,
      image: recBook.image,
      images: [recBook.image],
      format: "Paperback",
      category: recBook.category,
      genre: recBook.genre,
      rating: recBook.rating,
      reviews: 12,
      pages: 300,
      publisher: "",
      publishedYear: 2024,
      isbn: "",
      language: "English",
      description: "",
      isNew: false,
      isSale: recBook.is_sale,
      isBestseller: false,
      isTopRated: false,
      isSpecialOffer: false,
      inStock: recBook.in_stock,
      stockCount: recBook.stock_count,
      tags: [],
    };

    addToCart(matched, "Paperback");
    setAddedBookId(recBook.id);
    setTimeout(() => setAddedBookId(null), 2000);
  };

  const handleOpenBookModal = (recBook: any) => {
    if (onOpenBookDetail) {
      const matched: Book = books.find((b) => b.id === recBook.id) || {
        id: Number(recBook.id),
        title: recBook.title || "Book",
        author: recBook.author || "Author",
        price: Number(recBook.price || 0),
        originalPrice: Number(recBook.original_price ?? recBook.originalPrice ?? recBook.price ?? 0),
        image: recBook.image || "/images/personal-development/1.jpg",
        images: [recBook.image || "/images/personal-development/1.jpg"],
        format: recBook.format || "Paperback",
        category: recBook.category || "general",
        genre: recBook.genre || "General",
        rating: Number(recBook.rating || 0),
        reviews: Number(recBook.reviews || 12),
        pages: Number(recBook.pages || 300),
        publisher: recBook.publisher || "",
        publishedYear: Number(recBook.published_year || recBook.publishedYear || 2024),
        isbn: recBook.isbn || "",
        language: recBook.language || "English",
        description: recBook.description || "",
        isNew: Boolean(recBook.is_new || recBook.isNew),
        isSale: Boolean(recBook.is_sale || recBook.isSale),
        isBestseller: Boolean(recBook.is_bestseller || recBook.isBestseller),
        isTopRated: Boolean(recBook.is_top_rated || recBook.isTopRated),
        isSpecialOffer: Boolean(recBook.is_special_offer || recBook.isSpecialOffer),
        inStock: recBook.in_stock !== undefined ? Boolean(recBook.in_stock) : true,
        stockCount: Number(recBook.stock_count || 15),
        tags: [],
      };
      onOpenBookDetail(matched);
    }
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const rawLines = text.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;

    const formatInline = (str: string): string => {
      return str
        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-extrabold text-gray-900 dark:text-white'>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        .replace(/`([^`]+)`/g, '<code class="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded-md text-xs border border-emerald-300 dark:border-emerald-700/50">$1</code>');
    };

    while (i < rawLines.length) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // 1. Markdown Table Detection (lines with pipes)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        const validRows = tableLines.filter((l) => !/^\|[-:\s|]+\|$/.test(l));
        if (validRows.length > 0) {
          const parseRow = (r: string) =>
            r
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim());

          const headerCols = parseRow(validRows[0]);
          const dataRows = validRows.slice(1).map(parseRow);

          blocks.push(
            <div key={`table-${i}`} className="overflow-x-auto my-3 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/90 dark:bg-white/10 border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold">
                    {headerCols.map((h, hIdx) => (
                      <th key={hIdx} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] text-gray-700 dark:text-gray-200">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(h) }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-emerald-50/40 dark:hover:bg-white/5 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2.5 text-gray-800 dark:text-gray-200 leading-relaxed">
                          <span dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 2. Headings (###, ##, #)
      if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
        const headingText = trimmed.replace(/^#+\s*/, "");
        blocks.push(
          <div key={`h-${i}`} className="font-extrabold text-gray-900 dark:text-white text-[15px] sm:text-base mt-3.5 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatInline(headingText) }} />
          </div>
        );
        i++;
        continue;
      }

      // 3. Numbered lists (1. Item, 2. Item)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        const num = numMatch[1];
        const content = numMatch[2];
        blocks.push(
          <div key={`num-${i}`} className="flex items-start gap-2.5 my-2 pl-0.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center mt-0.5 border border-emerald-300 dark:border-emerald-700/50 shadow-2xs">
              {num}
            </span>
            <div className="flex-1 text-gray-800 dark:text-gray-100 text-[13.5px] sm:text-[14px] leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          </div>
        );
        i++;
        continue;
      }

      // 4. Bullet Points (•, -, *)
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.replace(/^[•\-*]\s*/, "");
        blocks.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1.5 pl-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2 shrink-0" />
            <div className="flex-1 text-gray-800 dark:text-gray-100 text-[13.5px] sm:text-[14px] leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          </div>
        );
        i++;
        continue;
      }

      // 5. Blockquote (> ...)
      if (trimmed.startsWith("> ")) {
        const quoteContent = trimmed.slice(2);
        blocks.push(
          <div key={`quote-${i}`} className="my-2.5 pl-3 py-1.5 border-l-3 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-r-xl text-gray-700 dark:text-gray-300 text-xs sm:text-[13px] italic">
            <span dangerouslySetInnerHTML={{ __html: formatInline(quoteContent) }} />
          </div>
        );
        i++;
        continue;
      }

      // 6. Regular Paragraph
      blocks.push(
        <p key={`p-${i}`} className="my-2 text-gray-800 dark:text-gray-100 text-[13.5px] sm:text-[14px] leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        </p>
      );
      i++;
    }

    return <div className="space-y-1">{blocks}</div>;
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] font-sans flex flex-col items-end">
      {/* ── EXPANDED CHAT FIELD / WINDOW (Much Bigger & Responsive) ── */}
      {isOpen && (
        <div
          className={`bg-white dark:bg-[#131722] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-gray-200/80 dark:border-white/10 flex flex-col overflow-hidden mb-3 animate-scale-in backdrop-blur-2xl transition-all duration-300 ${
            isFullscreen
              ? "w-[96vw] sm:w-[92vw] md:w-[860px] lg:w-[940px] h-[86vh] sm:h-[88vh] max-h-[860px]"
              : "w-[94vw] sm:w-[480px] md:w-[540px] lg:w-[580px] h-[78vh] sm:h-[650px] md:h-[680px] max-h-[720px]"
          }`}
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-emerald-900 text-white flex items-center justify-between shadow-lg relative overflow-hidden shrink-0">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 sm:gap-3.5 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-500 p-1 shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src="/bot.png"
                    alt="Fei"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#131722] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                    Fei AI Librarian
                  </h3>
                </div>
                <p className="text-xs text-emerald-200/85 flex items-center gap-1.5 mt-0.5">
                  <span>Khmer Bookstore Assistant</span>
              
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 relative z-10 shrink-0">
              {/* Maximize / Restore Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isFullscreen ? "Standard size" : "Expand larger"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleClearChat}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-4 py-2.5 bg-emerald-50/70 dark:bg-dark-card/80 border-b border-gray-200/60 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(sug.query)}
                className="shrink-0 text-xs sm:text-[13px] font-semibold bg-white dark:bg-white/5 hover:bg-emerald-100/90 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-emerald-950 dark:hover:text-emerald-300 border border-gray-200 dark:border-white/10 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>{sug.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Feed (Enlarged & Easy to Visualize) */}
          <div
            ref={chatFeedRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/70 dark:from-[#0c0f17] dark:via-[#131722] dark:to-[#0c0f17]"
          >
            {messages.map((msg, index) => {
              const isLatestAssistant = msg.role === "assistant" && index === messages.length - 1;
              const isLatestUser = msg.role === "user" && index === messages.length - 1;

              return (
                <div
                  key={msg.id}
                  ref={isLatestAssistant ? latestAssistantRef : (isLatestUser ? latestUserRef : null)}
                  className={`flex gap-3 sm:gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 shadow-sm mt-0.5 border border-emerald-600/30">
                    <img
                      src="/bot.png"
                      alt="Fei"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/50x50?text=Fei";
                      }}
                    />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4.5 py-3.5 sm:px-5 sm:py-4 text-[13.5px] sm:text-[14.5px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-800 text-white rounded-br-xs font-medium"
                        : "bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-white/10 rounded-bl-xs shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      renderFormattedText(msg.content)
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* Active Promo Copy Chip in chat if mentioned */}
                    {msg.content.includes("BOOKWORM15") && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-white/10 flex items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span className="font-mono font-bold text-sm text-emerald-900 dark:text-emerald-300">BOOKWORM15</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode("BOOKWORM15")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          {copiedCode === "BOOKWORM15" ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── RAG Book Recommendation Cards (Larger & Clearer) ── */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 w-full space-y-2.5">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Recommended Books in Store:
                      </p>
                      
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all flex gap-3.5 items-center group"
                          >
                            <img
                              src={rec.image}
                              alt={rec.title}
                              className="w-14 h-18 sm:w-16 sm:h-22 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200/80 dark:border-white/10 shadow-xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/60x85?text=Book";
                              }}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                                {rec.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                by {rec.author}
                              </p>
                              
                              <div className="flex items-center gap-2.5 mt-1.5">
                                <span className="font-black text-sm text-emerald-800 dark:text-emerald-400">
                                  ${rec.price.toFixed(2)}
                                </span>
                                {rec.original_price && rec.original_price > rec.price && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ${rec.original_price.toFixed(2)}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold ml-auto bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{rec.rating}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenBookModal(rec)}
                                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5" /> Details
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleAddToCartFromChat(rec)}
                                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                                    addedBookId === rec.id
                                      ? "bg-emerald-600"
                                      : "bg-emerald-800 hover:bg-emerald-700"
                                  }`}
                                >
                                  {addedBookId === rec.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" /> Added!
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 shadow-sm mt-0.5 border border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    )}
                  </div>
                )}
              </div>
            );
          })}

            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 shadow-sm mt-0.5 border border-emerald-600/30">
                  <img src="/bot.png" alt="Fei" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white dark:bg-dark-card border border-gray-200/80 dark:border-white/10 rounded-2xl rounded-bl-xs px-4.5 py-3.5 shadow-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1.5">
                    Fei is thinking & searching database...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer with High Performance Isolated ChatInputBar */}
          <ChatInputBar
            onSendMessage={(txt) => handleSendMessage(txt)}
            loading={loading}
            language={language}
          />
        </div>
      )}

      {/* ── CLOSED STATE: FLOATING CIRCLE BUTTON AT BOTTOM RIGHT ── */}
      {!isOpen && (
        <div className="relative flex items-center">
          {/* Welcome Tooltip when closed */}
          {showTooltip && (
            <div className="hidden sm:flex items-center gap-2.5 mr-3 bg-white dark:bg-dark-card text-gray-900 dark:text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-200 dark:border-white/10 text-xs sm:text-sm font-semibold animate-fade-in">
              
              <span>
                {language === "km"
                  ? "សួស្តី! សួរ Fei អំពីសៀវភៅ & ប្រូម៉ូសិន"
                  : "Ask Fei AI about books, discounts, Get recommend"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* The Toggle Button (Circle with Fei Image Logo & Orange Accent) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Book Assistant Chat"
            className="w-15 h-15 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(180,83,9,0.4)] relative group cursor-pointer bg-emerald-600 text-white hover:scale-110 active:scale-95 p-1"
          >
            {/* Animated Glow Ring */}
            <span className="absolute -inset-1 rounded-full bg-emerald-600 opacity-40 blur-md group-hover:opacity-75 transition-opacity animate-pulse" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-bg rounded-full z-10" />
            {hasUnread && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce z-20 shadow-md">
                1
              </span>
            )}

            {/* Icon / Logo inside circle */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden p-0.5 border border-orange-300/50 shadow-inner bg-orange-500">
                <img
                  src="/bot.png"
                  alt="Fei"
                  className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/50x50?text=Fei";
                  }}
                />
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

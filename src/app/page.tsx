"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Shield,
  Zap,
  Globe,
  Lock,
  Server,
  Check,
  Activity,
  MessageCircle,
  ChevronDown,
  CreditCard,
  Upload,
  Send,
  Copy,
  CheckCircle,
} from "lucide-react";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L3 7V12C3 17.25 6.75 21.5 12 22.75C17.25 21.5 21 17.25 21 12V7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  lock: <Lock className="w-6 h-6" />,
  server: <Server className="w-6 h-6" />,
  activity: <Activity className="w-6 h-6" />,
};

interface SiteData {
  adminRoute: string;
  telegramId: string;
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  servers: { id: string; name: string; flag: string; city: string; protocols: string[]; status: string; load: number }[];
  plans: { id: string; name: string; price: string; priceUnit: string; per: string; description: string; features: string[]; cta: string; popular: boolean; minGb: number; maxGb: number }[];
  features: { title: string; description: string; icon: string }[];
  faq: { question: string; answer: string }[];
  payment: { enabled: boolean; cardNumber: string; cardHolder: string; bankName: string; shabaNumber: string; phone: string; description: string };
}

import SupportWidget from "@/components/SupportWidget";

/* ─── پس‌زمینه ─── */
function BackgroundBeams() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "grid-move 3s linear infinite",
        }}
      />
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-400/5 rounded-full blur-[150px]" />
      <div className="absolute -bottom-[200px] right-1/4 w-[700px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#beam1)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#beam2)" strokeWidth="1" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#beam1)" strokeWidth="0.5" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#beam2)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ─── نوار بالا ─── */
function Navbar({ data }: { data: SiteData }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user_data");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  const links = [
    { label: "امکانات", href: "#features" },
    { label: "سرورها", href: "#servers" },
    { label: "قیمت‌ها", href: "#pricing" },
    { label: "سوالات", href: "#faq" },
    { label: "پشتیبانی", href: "/support" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20 py-3"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative">
            <ShieldIcon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-l from-cyan-400 to-cyan-200 bg-clip-text text-transparent font-black text-glow-cyan">
              pArSa
            </span>
            <span className="text-zinc-400 font-light mr-1">VPN</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <img src={user.avatar} alt="" className="w-6 h-6 rounded-full bg-white/10" />
                {user.name}
              </a>
              <button onClick={handleLogout} className="px-3 py-2 text-xs text-zinc-500 hover:text-red-400 transition-colors">خروج</button>
            </>
          ) : (
            <>
              <a href="/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">ورود</a>
              <a href="/register" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">ثبت‌نام</a>
            </>
          )}
          <a
            href="/support"
            className="flex items-center gap-2 group relative px-5 py-2.5 text-sm font-semibold text-black rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all duration-300 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 hover:scale-105"
          >
            <MessageCircle size={16} />
            پشتیبانی
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <a href="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-cyan-400 hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full bg-white/10" />
                    داشبورد من
                  </a>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-3 text-left text-red-400 hover:bg-red-400/5 rounded-lg transition-all">خروج</button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">ورود</a>
                  <a href="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">ثبت‌نام</a>
                </>
              )}
              <a href="/support" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-black rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300">
                <MessageCircle size={16} />
                پشتیبانی
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── هیرو ─── */
function Hero({ data }: { data: SiteData }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-[120px] animate-float" />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "-3s" }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-cyan-400/20"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm text-cyan-300">{data.heroBadge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.3] tracking-tight mb-6"
        >
          <span className="block bg-gradient-to-l from-cyan-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent text-glow-cyan">
            {data.heroTitle}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {data.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#pricing"
            className="group relative px-8 py-4 text-lg font-bold text-black rounded-2xl bg-gradient-to-l from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all duration-300 shadow-xl shadow-cyan-400/25 hover:shadow-cyan-400/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              همین الان شروع کن
              <Zap className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#servers"
            className="px-8 py-4 text-lg font-medium text-zinc-400 hover:text-white rounded-2xl glass hover:bg-white/5 transition-all duration-300"
          >
            سرورها رو ببین
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400/60" />
            <span>رمزنگاری AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400/60" />
            <span>۴ سرور جهانی</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400/60" />
            <span>Trojan & VLESS</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400/60" />
            <span>بدون لاگ و محدودیت</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── سرورها ─── */
function Servers({ data }: { data: SiteData }) {
  return (
    <section id="servers" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-cyan-400 text-sm font-medium mb-4 border border-cyan-400/10">
            سرورها
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            ۴ سرور اختصاصی{" "}
            <span className="bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              اروپایی
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            سرورهای ما در بهترین دیتاسنترهای اروپا با پینگ پایین و پهنای باند بالا فعال هستند.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.servers.map((server, i) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="spotlight-card border-beam glass rounded-2xl p-6 group hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{server.flag}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      server.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  <span className={`text-xs ${server.status === "online" ? "text-emerald-400" : "text-red-400"}`}>
                    {server.status === "online" ? "آنلاین" : "آفلاین"}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{server.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">{server.city}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {server.protocols.map((proto) => (
                  <span key={proto} className="px-2.5 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-xs font-medium">
                    {proto}
                  </span>
                ))}
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${server.load}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>بار سرور</span>
                <span>{server.load}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── امکانات ─── */
function Features({ data }: { data: SiteData }) {
  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-purple-400 text-sm font-medium mb-4 border border-purple-400/10">
            چرا pArSa VPN؟
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            یه سرویس VPN که{" "}
            <span className="bg-gradient-to-l from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              واقعاً کار می‌کنه
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            بدون دردسر، بدون قطعی، فقط اینترنت آزاد و پرسرعت.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="spotlight-card border-beam glass rounded-2xl p-6 group hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {iconMap[feat.icon] || <Zap className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── قیمت‌ها ─── */
function Pricing({ data }: { data: SiteData }) {
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: string; per: string } | null>(null);
  const [gigabytes, setGigabytes] = useState(10);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_data");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Parse Persian number from plan price
  const parsePrice = (str: string): number => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const cleaned = str.replace(/[^۰-۹0-9,]/g, "").replace(/,/g, "");
    let num = "";
    for (const ch of cleaned) {
      const idx = persianDigits.indexOf(ch);
      num += idx !== -1 ? String(idx) : ch;
    }
    return parseInt(num, 10) || 0;
  };

  const volumePlan = data.plans.find((p) => p.id === "volume");
  const unlimitedPlan = data.plans.find((p) => p.id === "unlimited");
  const unitPrice = volumePlan ? parsePrice(volumePlan.price) : 2000;
  const unlimitedPrice = unlimitedPlan ? parsePrice(unlimitedPlan.price) : 300000;
  const totalPrice = selectedPlan?.id === "volume" ? gigabytes * unitPrice : unlimitedPrice;
  const formattedPrice = totalPrice.toLocaleString("fa-IR");

  const openPurchase = (plan: { id: string; name: string; price: string; per: string }) => {
    if (!user) { window.location.href = "/login"; return; }
    setSelectedPlan(plan);
    const volPlan = data.plans.find((p) => p.id === plan.id);
    if (volPlan && volPlan.minGb) setGigabytes(volPlan.minGb);
    setShowPurchase(true);
    setSent(false);
    setReceipt(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!receipt || !selectedPlan) return;
    const token = localStorage.getItem("user_token");
    if (!token) return;
    setSending(true);
    try {
      await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          planType: selectedPlan.id === "volume" ? "volume" : "unlimited",
          gigabytes: selectedPlan.id === "volume" ? gigabytes : 0,
          totalPrice: formattedPrice + " تومان",
          receipt,
        }),
      });
      setSent(true);
    } catch {} finally { setSending(false); }
  };

  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[200px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-cyan-400 text-sm font-medium mb-4 border border-cyan-400/10">قیمت‌ها</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">یه پلن <span className="bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">مناسب خودت</span> انتخاب کن</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">قیمت‌ها مناسب و منصفانه‌ست. بدون هزینه پنهان.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {data.plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className={`relative rounded-3xl p-[1px] ${plan.popular ? "moving-border" : ""}`}>
              <div className={`relative rounded-3xl p-8 h-full flex flex-col ${plan.popular ? "bg-[#0d0d14] shadow-2xl shadow-cyan-400/10" : "glass"}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-l from-cyan-400 to-purple-400 text-xs font-bold text-black flex items-center gap-1.5"><Zap className="w-3 h-3" />محبوب‌ترین</div>}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">{plan.priceUnit} / {plan.per}</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feat, fi) => <li key={fi} className="flex items-start gap-3 text-sm text-zinc-400"><Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />{feat}</li>)}
                </ul>
                <button onClick={() => openPurchase(plan)} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.popular ? "bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]" : "glass text-white hover:bg-white/10 hover:scale-[1.02]"}`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchase && selectedPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPurchase(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">رسید ارسال شد!</h3>
                  <p className="text-zinc-400 text-sm mb-6">خرید شما برای بررسی ارسال شد. منتظر تأیید ادمین باشید.</p>
                  <button onClick={() => setShowPurchase(false)} className="px-6 py-3 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 text-black font-semibold text-sm">بستن</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">خرید {selectedPlan.name}</h3>
                    <button onClick={() => setShowPurchase(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={18} /></button>
                  </div>

                  {/* Volume GB selector */}
                  {selectedPlan.id === "volume" && (
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <label className="block text-sm text-zinc-400 mb-3">چند گیگابایت نیاز دارید؟</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={volumePlan?.minGb || 1}
                          max={volumePlan?.maxGb || 100}
                          value={gigabytes}
                          onChange={(e) => setGigabytes(Number(e.target.value))}
                          className="flex-1 accent-cyan-400"
                        />
                        <input
                          type="number"
                          min={volumePlan?.minGb || 1}
                          max={volumePlan?.maxGb || 100}
                          value={gigabytes}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            const min = volumePlan?.minGb || 1;
                            const max = volumePlan?.maxGb || 100;
                            setGigabytes(Math.max(min, Math.min(max, v)));
                          }}
                          className="w-20 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-center font-bold text-lg focus:outline-none focus:border-cyan-400/50"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{volumePlan?.minGb || 1} گیگ</span>
                        <span>{volumePlan?.maxGb || 100} گیگ</span>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/10 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">مبلغ قابل پرداخت:</span>
                      <span className="text-2xl font-black text-white">{formattedPrice} <span className="text-sm font-normal text-zinc-500">تومان</span></span>
                    </div>
                  </div>

                  {/* Card Info */}
                  {data.payment.enabled && data.payment.cardNumber && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm"><CreditCard size={16} />{data.payment.bankName || "کارت بانکی"}</div>
                        <button onClick={() => { navigator.clipboard.writeText(data.payment.cardNumber.replace(/\s/g, "")); }} className="text-xs text-cyan-400 hover:text-cyan-300"><Copy size={14} className="inline ml-1" />کپی</button>
                      </div>
                      <div className="font-mono text-lg text-white tracking-widest ltr text-center" dir="ltr">{data.payment.cardNumber}</div>
                      {data.payment.cardHolder && <div className="text-center text-zinc-400 text-xs mt-2">{data.payment.cardHolder}</div>}
                    </div>
                  )}

                  {/* Description */}
                  {data.payment.description && (
                    <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/10 mb-6">
                      <p className="text-xs text-amber-400 mb-1">توضیحات انتقال (الزامی):</p>
                      <p className="text-sm text-white font-medium">{data.payment.description}</p>
                    </div>
                  )}

                  {/* Upload */}
                  <div className="mb-6">
                    <label className="block text-sm text-zinc-400 mb-2">رسید پرداخت</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    {receipt ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img src={receipt} alt="رسید" className="w-full max-h-48 object-contain bg-black/30" />
                        <button onClick={() => { setReceipt(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-400/20"><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()} className="w-full py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-400/30 transition-all flex flex-col items-center gap-2 text-zinc-500 hover:text-cyan-400">
                        <Upload size={24} />
                        <span className="text-xs">اسکرین‌شات رسید رو آپلود کنید</span>
                      </button>
                    )}
                  </div>

                  <button onClick={handleSubmit} disabled={sending || !receipt} className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {sending ? "در حال ارسال..." : "ارسال رسید و ثبت خرید"}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── سوالات متداول ─── */
function FAQ({ data }: { data: SiteData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-emerald-400 text-sm font-medium mb-4 border border-emerald-400/10">
            سوالات متداول
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            سوالی داری؟
          </h2>
        </motion.div>

        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white text-sm md:text-base">{item.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-zinc-500 transition-transform duration-300 flex-shrink-0 mr-4 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── بخش پرداخت کارت به کارت ─── */
function PaymentSection({ data }: { data: SiteData }) {
  const [receipt, setReceipt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!data.payment.enabled) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const copyCard = () => {
    const num = data.payment.cardNumber.replace(/\s/g, "");
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="payment" className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-amber-400 text-sm font-medium mb-4 border border-amber-400/10">
            پرداخت
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            خرید و پرداخت
          </h2>
          <p className="text-zinc-400">
            مبلغ رو به کارت زیر واریز کنید و رسید رو آپلود کنید.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 space-y-6"
        >
          {/* Card Info */}
          {data.payment.cardNumber && (
            <div className="p-5 rounded-2xl bg-gradient-to-l from-cyan-400/10 to-purple-400/10 border border-cyan-400/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <CreditCard size={18} />
                  <span>{data.payment.bankName || "کارت بانکی"}</span>
                </div>
                <button onClick={copyCard} className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "کپی شد" : "کپی شماره"}
                </button>
              </div>
              <div className="font-mono text-2xl text-white tracking-widest ltr text-center mb-3" dir="ltr">
                {data.payment.cardNumber}
              </div>
              {data.payment.cardHolder && (
                <div className="text-center text-zinc-400 text-sm">
                  {data.payment.cardHolder}
                </div>
              )}
              {data.payment.shabaNumber && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="text-xs text-zinc-500 mb-1">شماره شبا:</div>
                  <div className="font-mono text-xs text-zinc-400 ltr text-center" dir="ltr">{data.payment.shabaNumber}</div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {data.payment.description && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs text-zinc-500 mb-1">توضیحات انتقال (الزامی):</div>
              <div className="text-sm text-white font-medium">{data.payment.description}</div>
            </div>
          )}

          {/* Upload Receipt */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">رسید پرداخت (اسکرین‌شات)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />

            {receipt ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img src={receipt} alt="رسید پرداخت" className="w-full max-h-80 object-contain bg-black/30" />
                  <button
                    onClick={() => { setReceipt(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-3 left-3 p-2 rounded-lg bg-black/60 text-red-400 hover:bg-red-400/20 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-l from-emerald-400 to-emerald-300 text-black hover:shadow-lg hover:shadow-emerald-400/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  ارسال رسید
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-10 rounded-2xl border-2 border-dashed border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all flex flex-col items-center gap-3 text-zinc-400 hover:text-cyan-400"
              >
                <Upload size={32} />
                <span className="text-sm">برای آپلود رسید کلیک کنید</span>
                <span className="text-xs text-zinc-600">JPG، PNG یا HEIC</span>
              </button>
            )}
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm text-center"
              >
                رسید شما با موفقیت ارسال شد. منتظر تأیید پشتیبانی باشید.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact */}
          <div className="text-center pt-2">
            <a
              href={data.telegramId ? `https://t.me/${data.telegramId}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <MessageCircle size={16} />
              ارسال رسید از طریق تلگرام
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── فوتر ─── */
function Footer({ data }: { data: SiteData }) {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <ShieldIcon className="w-6 h-6 text-cyan-400" />
            <span className="font-bold">
              <span className="bg-gradient-to-l from-cyan-400 to-cyan-200 bg-clip-text text-transparent">pArSa</span>
              <span className="text-zinc-400 font-light mr-1">VPN</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#features" className="hover:text-cyan-400 transition-colors">امکانات</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">قیمت‌ها</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">سوالات</a>
            <a href={data.telegramId ? `https://t.me/${data.telegramId}` : "#"} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">پشتیبانی تلگرام</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>تمام سرورها فعال</span>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center text-xs text-zinc-700">
          © ۱۴۰۵ pArSa VPN — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

/* ─── داده پیش‌فرض ─── */
const DEFAULT_DATA: SiteData = {
  adminRoute: "xK9mP2",
  telegramId: "",
  siteName: "pArSa VPN",
  heroTitle: "اینترنت بدون مرز",
  heroSubtitle: "با pArSa VPN به هر محتوایی دسترسی داشته باش. سریع، امن و بی‌دردسر.",
  heroBadge: "سرورها آنلاین — آپتایم ۹۹.۹٪",
  servers: [
    { id: "de", name: "آلمان", flag: "🇩🇪", city: "فرانکفورت", protocols: ["Trojan", "VLESS"], status: "online", load: 32 },
    { id: "fr", name: "فرانسه", flag: "🇫🇷", city: "پاریس", protocols: ["Trojan", "VLESS"], status: "online", load: 28 },
    { id: "nl", name: "هلند", flag: "🇳🇱", city: "آمستردام", protocols: ["Trojan", "VLESS"], status: "online", load: 45 },
    { id: "fi", name: "فنلاند", flag: "🇫🇮", city: "هلسینکی", protocols: ["Trojan", "VLESS"], status: "online", load: 18 },
  ],
  plans: [
    {
      id: "volume", name: "حجمی", price: "۲,۰۰۰", priceUnit: "تومان", per: "هر گیگابایت",
      description: "به اندازه نیازت مصرف کن، فقط بهای مصرفت رو بپرداز.",
      features: ["پرداخت به ازای مصرف", "پروتکل Trojan & VLESS", "تمام سرورها", "بدون محدودیت زمانی"],
      cta: "خرید حجمی", popular: false, minGb: 5, maxGb: 100,
    },
    {
      id: "unlimited", name: "نامحدود", price: "۳۰۰,۰۰۰", priceUnit: "تومان", per: "ماهانه",
      description: "ترافیک نامحدود + تمام سرورها. بهترین انتخاب برای استفاده روزمره.",
      features: ["ترافیک کاملاً نامحدود", "پروتکل Trojan & VLESS", "۴ سرور جهانی", "بدون قطعی و محدودیت", "پشتیبانی تلگرامی", "آپدیت رایگان"],
      cta: "خرید اشتراک نامحدود", popular: true, minGb: 0, maxGb: 0,
    },
  ],
  features: [
    { title: "پروتکل‌های پیشرفته", description: "از دو پروتکل Trojan و VLESS استفاده می‌کنیم که ترافیک شما رو کاملاً مخفی نگه می‌داره.", icon: "zap" },
    { title: "سرورهای اختصاصی اروپا", description: "۴ سرور اختصاصی در آلمان، فرانسه، هلند و فنلاند با پینگ پایین و پهنای باند بالا.", icon: "globe" },
    { title: "امنیت حرفه‌ای", description: "هیچ لاگی ذخیره نمیشه. حریم خصوصی شما برامون اولویت اوله.", icon: "shield" },
    { title: "ساده و راحت", description: "فقط کافیه لینک کانفیگ رو کپی کنی و توی اپ بزنی. کل فرایند کمتر از ۱ دقیقه طول می‌کشه.", icon: "lock" },
    { title: "پشتیبانی سریع", description: "تیم پشتیبانی ما توی تلگرام همیشه آنلاینه. هر سوالی داشتی فوری جواب می‌دیم.", icon: "server" },
    { title: "بدون قطعی", description: "سرورهای ما ۲۴ ساعته فعالن. هیچوقت وسط کارت قطع نمی‌شی.", icon: "activity" },
  ],
  faq: [
    { question: "از چه اپلیکیشنی استفاده کنم؟", answer: "برای اندروید از V2rayNG یا Hiddify و برای iOS از V2Box یا Streisand استفاده کنید." },
    { question: "تفاوت پروتکل Trojan و VLESS چیه؟", answer: "هر دو پروتکل امن و سریع هستن. VLESS با Reality سرعت بالاتری داره، Trojan هم عالیه و همه جا کار می‌کنه." },
    { question: "آیا ترافیک نامحدود واقعاً بدون محدودیته؟", answer: "بله. پلن نامحدود هیچ محدودیت حجمی نداره و می‌تونید بدون نگرانی استفاده کنید." },
    { question: "چطوری می‌تونم پرداخت کنم؟", answer: "از طریق تلگرام با پشتیبانی ارتباط بگیرید و پرداخت رو انجام بدید." },
    { question: "آیا امکان تست رایگان وجود داره؟", answer: "بله! یک ساعت تست رایگان بهتون داده می‌شه تا کیفیت سرویس رو امتحان کنید." },
  ],
  payment: {
    enabled: false,
    cardNumber: "",
    cardHolder: "",
    bankName: "",
    shabaNumber: "",
    phone: "",
    description: "خرید اشتراک pArSa VPN",
  },
};

/* ─── صفحه اصلی ─── */
export default function Home() {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((d) => setData(d))
      .catch((err) => {
        console.warn("API unavailable, using default data:", err);
      });
  }, []);

  return (
    <main className="relative">
      <BackgroundBeams />
      <Navbar data={data} />
      <Hero data={data} />
      <Servers data={data} />
      <Features data={data} />
      <Pricing data={data} />
      <FAQ data={data} />
      <Footer data={data} />
      <SupportWidget />
    </main>
  );
}

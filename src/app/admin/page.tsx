"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Globe,
  Server,
  Check,
  Zap,
  Lock,
  Activity,
  Star,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Pencil,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  KeyRound,
  Copy,
  RefreshCw,
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

interface SiteData {
  adminRoute: string;
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  servers: { id: string; name: string; flag: string; city: string; protocols: string[]; status: string; load: number }[];
  plans: { id: string; name: string; price: string; priceUnit: string; per: string; description: string; features: string[]; cta: string; popular: boolean }[];
  features: { title: string; description: string; icon: string }[];
  faq: { question: string; answer: string }[];
}

/* ─── صفحه ورود ─── */
function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = btoa(`${username}:${password}`);
      const res = await fetch("/api/content", {
        headers: { Authorization: `Basic ${token}` },
      });

      if (res.ok) {
        localStorage.setItem("admin_token", token);
        onLogin(token);
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است");
      }
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-cyan-400/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-l from-cyan-400/20 to-purple-400/20 flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="w-9 h-9 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">پنل مدیریت</h1>
            <p className="text-zinc-500 text-sm">pArSa VPN — داشبورد مدیریت</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">نام کاربری</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all"
                placeholder="نام کاربری"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all"
                  placeholder="رمز عبور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── پنل مدیریت ─── */
function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "servers" | "plans" | "features" | "faq" | "security">("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/content", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {
      console.error("Failed to fetch");
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveData = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const updateServer = (index: number, field: string, value: string | number) => {
    if (!data) return;
    const servers = [...data.servers];
    (servers[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, servers });
  };

  const addServer = () => {
    if (!data) return;
    setData({
      ...data,
      servers: [
        ...data.servers,
        { id: `srv${Date.now()}`, name: "جدید", flag: "🏳️", city: "شهر", protocols: ["Trojan"], status: "online", load: 0 },
      ],
    });
  };

  const removeServer = (index: number) => {
    if (!data) return;
    const servers = data.servers.filter((_, i) => i !== index);
    setData({ ...data, servers });
  };

  const updatePlan = (index: number, field: string, value: string | boolean) => {
    if (!data) return;
    const plans = [...data.plans];
    (plans[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, plans });
  };

  const updatePlanFeature = (planIndex: number, featIndex: number, value: string) => {
    if (!data) return;
    const plans = [...data.plans];
    const features = [...plans[planIndex].features];
    features[featIndex] = value;
    plans[planIndex] = { ...plans[planIndex], features };
    setData({ ...data, plans });
  };

  const addPlanFeature = (planIndex: number) => {
    if (!data) return;
    const plans = [...data.plans];
    plans[planIndex] = { ...plans[planIndex], features: [...plans[planIndex].features, ""] };
    setData({ ...data, plans });
  };

  const removePlanFeature = (planIndex: number, featIndex: number) => {
    if (!data) return;
    const plans = [...data.plans];
    const features = plans[planIndex].features.filter((_, i) => i !== featIndex);
    plans[planIndex] = { ...plans[planIndex], features };
    setData({ ...data, plans });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    if (!data) return;
    const features = [...data.features];
    (features[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, features });
  };

  const addFeature = () => {
    if (!data) return;
    setData({
      ...data,
      features: [...data.features, { title: "جدید", description: "توضیحات", icon: "zap" }],
    });
  };

  const removeFeature = (index: number) => {
    if (!data) return;
    const features = data.features.filter((_, i) => i !== index);
    setData({ ...data, features });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    if (!data) return;
    const faq = [...data.faq];
    (faq[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, faq });
  };

  const addFaq = () => {
    if (!data) return;
    setData({
      ...data,
      faq: [...data.faq, { question: "سوال جدید", answer: "پاسخ" }],
    });
  };

  const removeFaq = (index: number) => {
    if (!data) return;
    const faq = data.faq.filter((_, i) => i !== index);
    setData({ ...data, faq });
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#06060b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "hero" as const, label: "هیرو و تیترها", icon: <Pencil size={16} /> },
    { id: "servers" as const, label: "سرورها", icon: <Server size={16} /> },
    { id: "plans" as const, label: "پلن‌ها", icon: <Star size={16} /> },
    { id: "features" as const, label: "امکانات", icon: <Zap size={16} /> },
    { id: "faq" as const, label: "سوالات", icon: <MessageCircle size={16} /> },
    { id: "security" as const, label: "امنیت و مسیر مخفی", icon: <KeyRound size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldIcon className="w-7 h-7 text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold">پنل مدیریت</h1>
              <p className="text-xs text-zinc-500">pArSa VPN Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white glass hover:bg-white/5 transition-all"
            >
              <Eye size={16} />
              مشاهده سایت
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 glass hover:bg-red-500/10 transition-all"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/20"
                  : "text-zinc-400 hover:text-white glass hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6 md:p-8">
          {/* Hero Tab */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">تیترها و متن‌های اصلی</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">عنوان سایت</label>
                <input
                  value={data.siteName}
                  onChange={(e) => updateField("siteName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">تیتر اصلی هیرو</label>
                <input
                  value={data.heroTitle}
                  onChange={(e) => updateField("heroTitle", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">زیرتیتر هیرو</label>
                <textarea
                  value={data.heroSubtitle}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">نشان وضعیت</label>
                <input
                  value={data.heroBadge}
                  onChange={(e) => updateField("heroBadge", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Servers Tab */}
          {activeTab === "servers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مدیریت سرورها</h2>
                <button
                  onClick={addServer}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
                >
                  <Plus size={16} />
                  افزودن سرور
                </button>
              </div>
              {data.servers.map((server, i) => (
                <div key={server.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{server.flag}</span>
                      <span className="font-bold">{server.name}</span>
                    </div>
                    <button
                      onClick={() => removeServer(i)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">نام</label>
                      <input
                        value={server.name}
                        onChange={(e) => updateServer(i, "name", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">پرچم (ایموجی)</label>
                      <input
                        value={server.flag}
                        onChange={(e) => updateServer(i, "flag", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">شهر</label>
                      <input
                        value={server.city}
                        onChange={(e) => updateServer(i, "city", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">وضعیت</label>
                      <select
                        value={server.status}
                        onChange={(e) => updateServer(i, "status", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      >
                        <option value="online">آنلاین</option>
                        <option value="offline">آفلاین</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === "plans" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">مدیریت پلن‌ها</h2>
              {data.plans.map((plan, i) => (
                <div key={plan.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{plan.name}</span>
                      {plan.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 text-xs font-medium">
                          محبوب
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.popular}
                        onChange={(e) => updatePlan(i, "popular", e.target.checked)}
                        className="accent-cyan-400"
                      />
                      محبوب‌ترین
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">نام پلن</label>
                      <input
                        value={plan.name}
                        onChange={(e) => updatePlan(i, "name", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">قیمت</label>
                      <input
                        value={plan.price}
                        onChange={(e) => updatePlan(i, "price", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">واحد قیمت</label>
                      <input
                        value={plan.priceUnit}
                        onChange={(e) => updatePlan(i, "priceUnit", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">دوره</label>
                      <input
                        value={plan.per}
                        onChange={(e) => updatePlan(i, "per", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">توضیحات پلن</label>
                    <textarea
                      value={plan.description}
                      onChange={(e) => updatePlan(i, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">ویژگی‌ها</label>
                    <div className="space-y-2">
                      {plan.features.map((feat, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input
                            value={feat}
                            onChange={(e) => updatePlanFeature(i, fi, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                          />
                          <button
                            onClick={() => removePlanFeature(i, fi)}
                            className="px-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addPlanFeature(i)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                      >
                        <Plus size={12} />
                        افزودن ویژگی
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مدیریت امکانات</h2>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
                >
                  <Plus size={16} />
                  افزودن امکان
                </button>
              </div>
              {data.features.map((feat, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">امکان {i + 1}</span>
                    <button
                      onClick={() => removeFeature(i)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">عنوان</label>
                      <input
                        value={feat.title}
                        onChange={(e) => updateFeature(i, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">آیکون (نام lucide)</label>
                      <input
                        value={feat.icon}
                        onChange={(e) => updateFeature(i, "icon", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">توضیحات</label>
                    <textarea
                      value={feat.description}
                      onChange={(e) => updateFeature(i, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مدیریت سوالات متداول</h2>
                <button
                  onClick={addFaq}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
                >
                  <Plus size={16} />
                  افزودن سوال
                </button>
              </div>
              {data.faq.map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">سوال {i + 1}</span>
                    <button
                      onClick={() => removeFaq(i)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">سوال</label>
                    <input
                      value={item.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">پاسخ</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-2">امنیت و مسیر مخفی پنل</h2>
              <p className="text-zinc-500 text-sm mb-6">
                با تنظیم مسیر مخفی، آدرس <code className="px-2 py-0.5 rounded bg-white/5 text-cyan-400">/admin</code> غیرفعال می‌شه و فقط با آدرس اختصاصی خودت قابل دسترسه.
              </p>

              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300 mb-1">نکته امنیتی</h4>
                    <p className="text-xs text-amber-400/70 leading-relaxed">
                      آدرس مخفی خود را در جای امنی ذخیره کنید. در صورت فراموشی، باید مستقیماً فایل <code className="px-1.5 py-0.5 rounded bg-white/5">site.json</code> را ویرایش کنید.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">مسیر مخفی پنل مدیریت</label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">/</span>
                      <input
                        value={data.adminRoute}
                        onChange={(e) => updateField("adminRoute", e.target.value)}
                        className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                        placeholder="مثلاً: xK9mP2"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let result = "";
                        for (let i = 0; i < 8; i++) {
                          result += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        updateField("adminRoute", result);
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all text-sm font-medium"
                    >
                      <RefreshCw size={16} />
                      تصادفی
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-500 mb-3">آدرس فعلی پنل مدیریت:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-400/5 border border-cyan-400/10 text-cyan-400 font-mono text-sm">
                      {typeof window !== "undefined" ? window.location.origin : ""}/{data.adminRoute}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/${data.adminRoute}`
                        );
                      }}
                      className="p-2.5 rounded-lg glass hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                      title="کپی آدرس"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-500 mb-3">آدرس قدیمی (غیرفعال):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2.5 rounded-lg bg-red-400/5 border border-red-400/10 text-red-400/60 font-mono text-sm line-through">
                      {typeof window !== "undefined" ? window.location.origin : ""}/admin
                    </code>
                    <span className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-medium">
                      مسدود
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl glass border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-3">چطور کار می‌کنه؟</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۱.</span>
                    آدرس مخفی خود را تنظیم کنید (می‌تونید دکمه تصادفی رو بزنید)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۲.</span>
                    تغییرات رو ذخیره کنید
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۳.</span>
                    از این به بعد فقط با آدرس <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400">/{data.adminRoute}</code> وارد پنل بشید
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۴.</span>
                    کسی که آدرس <code className="px-1.5 py-0.5 rounded bg-white/5 text-red-400">/admin</code> رو باز کنه، به آدرس مخفی ریدایرکت می‌شه
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/5">
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-400 flex items-center gap-1"
                >
                  <Check size={16} />
                  ذخیره شد
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 glass hover:bg-white/5 hover:text-white transition-all"
            >
              <RotateCcw size={16} />
              بازنشانی
            </button>
            <button
              onClick={saveData}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── صفحه اصلی ادمین ─── */
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

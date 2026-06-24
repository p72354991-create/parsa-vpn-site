"use client";

import { useState, useEffect, useCallback, use } from "react";
import { notFound } from "next/navigation";
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
  CreditCard,
  Send,
  CheckCircle,
  Clock,
  ExternalLink,
  XCircle,
  User,
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
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
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
  const [activeTab, setActiveTab] = useState<"hero" | "servers" | "plans" | "features" | "faq" | "security" | "payment" | "support" | "purchases" | "stats" | "admins" | "users">("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supportMessages, setSupportMessages] = useState<{ id: string; userId: string; userName: string; userEmail: string; category: string; subject: string; messages: { sender: string; text: string; time: string }[]; status: string; createdAt: string }[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [selectedUserInfo, setSelectedUserInfo] = useState<{ user: { id: string; name: string; email: string; phone: string; avatar: string; provider: string; createdAt: string }; stats: { openTickets: number; closedTickets: number; totalMessages: number; totalReplies: number }; tickets: { id: string; category: string; subject: string; status: string; messageCount: number; lastMessage: string; lastTime: string; createdAt: string }[] } | null>(null);
  const [purchases, setPurchases] = useState<{ id: string; userId: string; userName: string; planType: string; gigabytes: number; totalPrice: string; receipt: string; status: string; rejectReason: string; subscriptionLink: string; createdAt: string; approvedAt: string }[]>([]);
  const [subLink, setSubLink] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [viewReceipt, setViewReceipt] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string; createdAt: string }[]>([]);
  const [adminList, setAdminList] = useState<{ id: string; username: string; name: string; role: string; createdAt: string }[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", name: "", role: "support" });
  const [ownerPassChange, setOwnerPassChange] = useState({ current: "", newPass: "", newUsername: "" });
  const [userList, setUserList] = useState<{ id: string; name: string; email: string; phone: string; avatar: string; provider: string; createdAt: string; stats: { totalPurchases: number; activeSubscriptions: number; pendingPurchases: number }; activeSubscriptions: { id: string; planType: string; gigabytes: number; totalPrice: string; subscriptionLink: string; approvedAt: string }[] }[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { headers: { Authorization: `Basic ${token}` } });
      if (res.ok) setData(await res.json());
    } catch { console.error("Failed to fetch"); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveData = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { Authorization: `Basic ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { console.error("Failed to save"); } finally { setSaving(false); }
  };

  const updateField = (field: keyof SiteData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const fetchSupportMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/support?admin=true", {
        headers: { Authorization: `Basic ${btoa("admin:" + process.env.NEXT_PUBLIC_ADMIN_PASS || "parsa2026")}` },
      });
      const d = await res.json();
      if (Array.isArray(d)) setSupportMessages(d);
    } catch {}
  }, []);

  useEffect(() => { if (activeTab === "support") fetchSupportMessages(); }, [activeTab, fetchSupportMessages]);

  // Poll support messages every 5 seconds when on support tab
  useEffect(() => {
    if (activeTab !== "support") return;
    const interval = setInterval(fetchSupportMessages, 5000);
    return () => clearInterval(interval);
  }, [activeTab, fetchSupportMessages]);

  const handleAdminReply = async (messageId: string) => {
    if (!adminReply) return;
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: true, messageId, text: adminReply }),
      });
      setSupportMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, messages: [...m.messages, { sender: "admin", text: adminReply, time: new Date().toISOString() }] } : m));
      setAdminReply("");
    } catch {}
  };

  const handleCloseThread = async (messageId: string) => {
    try {
      await fetch("/api/support", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      setSupportMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, status: "closed" } : m));
    } catch {}
  };

  const fetchUserInfo = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/user?id=${userId}`);
      const data = await res.json();
      if (data.user) setSelectedUserInfo(data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!selectedThread) { setSelectedUserInfo(null); return; }
    const thread = supportMessages.find((m) => m.id === selectedThread);
    if (thread) fetchUserInfo(thread.userId);
  }, [selectedThread, supportMessages, fetchUserInfo]);

  // Purchases
  const fetchPurchases = useCallback(async () => {
    try {
      const res = await fetch("/api/purchases?admin=true");
      const d = await res.json();
      if (Array.isArray(d)) setPurchases(d);
    } catch {}
  }, []);

  useEffect(() => { if (activeTab === "purchases") fetchPurchases(); }, [activeTab, fetchPurchases]);
  useEffect(() => {
    if (activeTab !== "purchases") return;
    const interval = setInterval(fetchPurchases, 5000);
    return () => clearInterval(interval);
  }, [activeTab, fetchPurchases]);

  const handleApprove = async (purchaseId: string) => {
    try {
      await fetch("/api/purchases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, action: "approve", subscriptionLink: subLink }),
      });
      setPurchases((prev) => prev.map((p) => p.id === purchaseId ? { ...p, status: "approved", subscriptionLink: subLink, approvedAt: new Date().toISOString() } : p));
      setSubLink("");
    } catch {}
  };

  const handleReject = async (purchaseId: string) => {
    try {
      await fetch("/api/purchases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, action: "reject", reason: rejectReason }),
      });
      setPurchases((prev) => prev.map((p) => p.id === purchaseId ? { ...p, status: "rejected", rejectReason } : p));
      setRejectReason("");
    } catch {}
  };

  // Stats
  const fetchStats = useCallback(async () => {
    try {
      const [pRes, uRes] = await Promise.all([
        fetch("/api/purchases?admin=true"),
        fetch("/api/content", { headers: { Authorization: `Basic ${btoa("admin:" + (process.env.NEXT_PUBLIC_ADMIN_PASS || "parsa2026"))}` } }),
      ]);
      const pData = await pRes.json();
      if (Array.isArray(pData)) setPurchases(pData);
      // We don't have a users API, but purchases have userId
    } catch {}
  }, []);

  useEffect(() => { if (activeTab === "stats") fetchStats(); }, [activeTab, fetchStats]);

  // Admins
  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/admins", { headers: { Authorization: `Basic ${token}` } });
      const d = await res.json();
      if (Array.isArray(d)) setAdminList(d);
    } catch {}
  }, [token]);

  useEffect(() => { if (activeTab === "admins") fetchAdmins(); }, [activeTab, fetchAdmins]);

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password || !newAdmin.name) return;
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${token}` },
        body: JSON.stringify(newAdmin),
      });
      if (res.ok) { setNewAdmin({ username: "", password: "", name: "", role: "support" }); fetchAdmins(); }
    } catch {}
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await fetch(`/api/admin/admins?id=${id}`, { method: "DELETE", headers: { Authorization: `Basic ${token}` } });
      fetchAdmins();
    } catch {}
  };

  // Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Basic ${token}` } });
      const d = await res.json();
      if (Array.isArray(d)) setUserList(d);
    } catch {}
  }, [token]);

  useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab, fetchUsers]);

  const handleDeactivateSub = async (purchaseId: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${token}` },
        body: JSON.stringify({ purchaseId, action: "deactivate" }),
      });
      fetchUsers();
    } catch {}
  };

  const handleDeactivateSubWithReason = async (purchaseId: string, reason: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${token}` },
        body: JSON.stringify({ purchaseId, action: "deactivate", reason }),
      });
      fetchUsers();
    } catch {}
  };

  const updateServer = (index: number, field: string, value: string | number) => {
    if (!data) return;
    const servers = [...data.servers];
    (servers[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, servers });
  };

  const addServer = () => {
    if (!data) return;
    setData({ ...data, servers: [...data.servers, { id: `srv${Date.now()}`, name: "جدید", flag: "🏳️", city: "شهر", protocols: ["Trojan"], status: "online", load: 0 }] });
  };

  const removeServer = (index: number) => {
    if (!data) return;
    setData({ ...data, servers: data.servers.filter((_, i) => i !== index) });
  };

  const updatePlan = (index: number, field: string, value: string | boolean | number) => {
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
    plans[planIndex] = { ...plans[planIndex], features: plans[planIndex].features.filter((_, i) => i !== featIndex) };
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
    setData({ ...data, features: [...data.features, { title: "جدید", description: "توضیحات", icon: "zap" }] });
  };

  const removeFeature = (index: number) => {
    if (!data) return;
    setData({ ...data, features: data.features.filter((_, i) => i !== index) });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    if (!data) return;
    const faq = [...data.faq];
    (faq[index] as Record<string, unknown>)[field] = value;
    setData({ ...data, faq });
  };

  const addFaq = () => {
    if (!data) return;
    setData({ ...data, faq: [...data.faq, { question: "سوال جدید", answer: "پاسخ" }] });
  };

  const removeFaq = (index: number) => {
    if (!data) return;
    setData({ ...data, faq: data.faq.filter((_, i) => i !== index) });
  };

  const generateRandomRoute = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#06060b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "hero" as const, label: "هیرو", icon: <Pencil size={18} /> },
    { id: "servers" as const, label: "سرورها", icon: <Server size={18} /> },
    { id: "plans" as const, label: "پلن‌ها", icon: <Star size={18} /> },
    { id: "features" as const, label: "امکانات", icon: <Zap size={18} /> },
    { id: "faq" as const, label: "سوالات", icon: <MessageCircle size={18} /> },
    { id: "payment" as const, label: "پرداخت", icon: <CreditCard size={18} /> },
    { id: "purchases" as const, label: "خریدها", icon: <CheckCircle size={18} /> },
    { id: "support" as const, label: "پشتیبانی", icon: <MessageCircle size={18} /> },
    { id: "stats" as const, label: "آمار", icon: <Activity size={18} /> },
    { id: "admins" as const, label: "ادمین‌ها", icon: <User size={18} /> },
    { id: "users" as const, label: "کاربران", icon: <Globe size={18} /> },
    { id: "security" as const, label: "امنیت", icon: <KeyRound size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#06060b] text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-56 glass-strong border-l border-white/5 fixed top-0 right-0 bottom-0 z-40">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <ShieldIcon className="w-7 h-7 text-cyan-400" />
            <div>
              <h1 className="text-sm font-bold">پنل مدیریت</h1>
              <p className="text-[10px] text-zinc-500">pArSa VPN</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-400/10 text-cyan-400 border-r-2 border-cyan-400"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            <Eye size={14} /> مشاهده سایت
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={14} /> خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:mr-56">
        {/* Mobile Header */}
        <header className="lg:hidden glass-strong border-b border-white/5 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldIcon className="w-6 h-6 text-cyan-400" />
              <span className="text-sm font-bold">پنل مدیریت</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" className="p-2 text-zinc-400 hover:text-white"><Eye size={18} /></a>
              <button onClick={onLogout} className="p-2 text-red-400"><LogOut size={18} /></button>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 text-[10px] min-w-[60px] transition-all ${
                  activeTab === tab.id ? "text-cyan-400" : "text-zinc-500"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="p-4 lg:p-8 pb-24 lg:pb-8">
          {/* Hero Tab */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">تیترها و متن‌های اصلی</h2>
              {[
                { label: "عنوان سایت", field: "siteName" as const },
                { label: "تیتر اصلی هیرو", field: "heroTitle" as const },
                { label: "نشان وضعیت", field: "heroBadge" as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-sm text-zinc-400 mb-2">{label}</label>
                  <input
                    value={data[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">زیرتیتر هیرو</label>
                <textarea
                  value={data.heroSubtitle}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Servers Tab */}
          {activeTab === "servers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مدیریت سرورها</h2>
                <button onClick={addServer} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all">
                  <Plus size={16} /> افزودن سرور
                </button>
              </div>
              {data.servers.map((server, i) => (
                <div key={server.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{server.flag}</span>
                      <span className="font-bold">{server.name}</span>
                    </div>
                    <button onClick={() => removeServer(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "نام", field: "name", val: server.name },
                      { label: "پرچم (ایموجی)", field: "flag", val: server.flag },
                      { label: "شهر", field: "city", val: server.city },
                    ].map(({ label, field, val }) => (
                      <div key={field}>
                        <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                        <input value={val} onChange={(e) => updateServer(i, field, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">وضعیت</label>
                      <select value={server.status} onChange={(e) => updateServer(i, "status", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all">
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
                      {plan.popular && <span className="px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 text-xs font-medium">محبوب</span>}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                      <input type="checkbox" checked={plan.popular} onChange={(e) => updatePlan(i, "popular", e.target.checked)} className="accent-cyan-400" />
                      محبوب‌ترین
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "نام پلن", field: "name", val: plan.name },
                      { label: "قیمت", field: "price", val: plan.price },
                      { label: "واحد قیمت", field: "priceUnit", val: plan.priceUnit },
                      { label: "دوره", field: "per", val: plan.per },
                    ].map(({ label, field, val }) => (
                      <div key={field}>
                        <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                        <input value={val} onChange={(e) => updatePlan(i, field, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">توضیحات پلن</label>
                    <textarea value={plan.description} onChange={(e) => updatePlan(i, "description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none" />
                  </div>
                  {plan.id === "volume" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">حداقل گیگابایت</label>
                        <input type="number" min={1} value={plan.minGb || 1} onChange={(e) => updatePlan(i, "minGb", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                        <p className="text-[10px] text-zinc-600 mt-1">کاربر نمی‌تونه کمتر از این مقدار بخره</p>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">حداکثر گیگابایت</label>
                        <input type="number" min={1} value={plan.maxGb || 100} onChange={(e) => updatePlan(i, "maxGb", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                        <p className="text-[10px] text-zinc-600 mt-1">بیشترین مقدار قابل خرید</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">ویژگی‌ها</label>
                    <div className="space-y-2">
                      {plan.features.map((feat, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input value={feat} onChange={(e) => updatePlanFeature(i, fi, e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                          <button onClick={() => removePlanFeature(i, fi)} className="px-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => addPlanFeature(i)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Plus size={12} /> افزودن ویژگی</button>
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
                <button onClick={addFeature} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"><Plus size={16} /> افزودن امکان</button>
              </div>
              {data.features.map((feat, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">امکان {i + 1}</span>
                    <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">عنوان</label>
                      <input value={feat.title} onChange={(e) => updateFeature(i, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">آیکون (نام lucide)</label>
                      <input value={feat.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">توضیحات</label>
                    <textarea value={feat.description} onChange={(e) => updateFeature(i, "description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none" />
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
                <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"><Plus size={16} /> افزودن سوال</button>
              </div>
              {data.faq.map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">سوال {i + 1}</span>
                    <button onClick={() => removeFaq(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">سوال</label>
                    <input value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">پاسخ</label>
                    <textarea value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-2">اطلاعات کارت به کارت</h2>
              <p className="text-zinc-500 text-sm mb-6">
                اطلاعات کارت بانکی خود را وارد کنید. کاربران هنگام خرید این اطلاعات را مشاهده و به کارت شما واریز می‌کنند.
              </p>

              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">نمایش اطلاعات پرداخت</h4>
                  <p className="text-xs text-zinc-500 mt-1">با فعال کردن، اطلاعات کارت در صفحه خرید نمایش داده می‌شه</p>
                </div>
                <button
                  onClick={() => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, enabled: !data.payment.enabled } });
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    data.payment.enabled ? "bg-cyan-400" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                      data.payment.enabled ? "right-0.5" : "right-[26px]"
                    }`}
                  />
                </button>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">شماره کارت</label>
                <input
                  value={data.payment.cardNumber}
                  onChange={(e) => {
                    if (!data) return;
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = v.replace(/(\d{4})(?=\d)/g, "$1 ");
                    setData({ ...data, payment: { ...data.payment, cardNumber: formatted } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-400/50 transition-all ltr text-left"
                  placeholder="6037 9970 0000 0000"
                  dir="ltr"
                />
              </div>

              {/* Card Holder */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">نام صاحب کارت</label>
                <input
                  value={data.payment.cardHolder}
                  onChange={(e) => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, cardHolder: e.target.value } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                  placeholder="علی رضایی"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">نام بانک</label>
                <input
                  value={data.payment.bankName}
                  onChange={(e) => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, bankName: e.target.value } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                  placeholder="بانک ملت"
                />
              </div>

              {/* Shaba */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">شماره شبا (اختیاری)</label>
                <input
                  value={data.payment.shabaNumber}
                  onChange={(e) => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, shabaNumber: e.target.value } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-all ltr text-left"
                  placeholder="IR 0000 0000 0000 0000 0000 0000"
                  dir="ltr"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">شماره تماس (اختیاری)</label>
                <input
                  value={data.payment.phone}
                  onChange={(e) => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, phone: e.target.value } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">توضیحات انتقال</label>
                <input
                  value={data.payment.description}
                  onChange={(e) => {
                    if (!data) return;
                    setData({ ...data, payment: { ...data.payment, description: e.target.value } });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                  placeholder="خرید اشتراک pArSa VPN"
                />
                <p className="text-xs text-zinc-600 mt-1.5">این متن به کاربر نمایش داده می‌شه تا در توضیحات انتقال وارد کنه.</p>
              </div>

              {/* Info */}
              <div className="p-5 rounded-xl glass border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-3">نحوه کار</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۱.</span>
                    اطلاعات کارت خود را بالا وارد کنید
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۲.</span>
                    تغییرات رو ذخیره کنید
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۳.</span>
                    کاربر هنگام خرید، شماره کارت و مبلغ رو می‌بینه
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۴.</span>
                    کاربر به کارت واریز می‌کنه و رسید (اسکرین‌شات) رو آپلود می‌کنه
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۵.</span>
                    شما رسید رو بررسی و اشتراک رو فعال می‌کنید
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === "purchases" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">تایید خریدها</h2>
                <button onClick={fetchPurchases} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all">
                  <RotateCcw size={16} /> بروزرسانی
                </button>
              </div>

              {purchases.filter((p) => p.status === "pending").length === 0 && purchases.filter((p) => p.status === "approved").length === 0 && purchases.filter((p) => p.status === "rejected").length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>هنوز خریدی ثبت نشده.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pending */}
                  {purchases.filter((p) => p.status === "pending").length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2"><Clock size={14} /> در انتظار تایید ({purchases.filter((p) => p.status === "pending").length})</h3>
                      <div className="space-y-3">
                        {purchases.filter((p) => p.status === "pending").map((p) => (
                          <div key={p.id} className="glass rounded-2xl p-5">
                            <div className="flex flex-col lg:flex-row gap-4">
                              {/* Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-bold text-white">{p.userName}</span>
                                  <span className="text-xs text-zinc-500">{p.planType === "volume" ? `حجمی — ${p.gigabytes} گیگ` : "نامحدود ماهانه"}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mb-1">مبلغ: <span className="text-white">{p.totalPrice}</span></p>
                                <p className="text-xs text-zinc-500">تاریخ: {new Date(p.createdAt).toLocaleDateString("fa-IR")}</p>
                              </div>
                              {/* Receipt */}
                              {p.receipt && (
                                <div className="lg:w-48">
                                  <button onClick={() => setViewReceipt(p.receipt)} className="block rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
                                    <img src={p.receipt} alt="رسید" className="w-full h-32 object-cover" />
                                  </button>
                                </div>
                              )}
                            </div>
                            {/* Actions */}
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                              <div>
                                <label className="text-xs text-zinc-500 mb-1 block">لینک اشتراک (برای تایید):</label>
                                <input value={subLink} onChange={(e) => setSubLink(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono ltr text-left focus:outline-none focus:border-cyan-400/50" placeholder="https://example.com/sub/..." dir="ltr" />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleApprove(p.id)} disabled={!subLink} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-medium hover:bg-emerald-400/20 transition-all disabled:opacity-50">
                                  <CheckCircle size={14} /> تایید و ارسال لینک
                                </button>
                                <button onClick={() => { if (rejectReason) handleReject(p.id); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-medium hover:bg-red-400/20 transition-all">
                                  <XCircle size={14} /> رد
                                </button>
                              </div>
                              <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-red-400/50" placeholder="دلیل رد (اختیاری)" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approved */}
                  {purchases.filter((p) => p.status === "approved").length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle size={14} /> تایید شده ({purchases.filter((p) => p.status === "approved").length})</h3>
                      <div className="space-y-2">
                        {purchases.filter((p) => p.status === "approved").map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-emerald-400" />
                              <div>
                                <span className="text-sm text-white">{p.userName}</span>
                                <span className="text-xs text-zinc-500 mr-2">{p.planType === "volume" ? `${p.gigabytes} گیگ` : "نامحدود"} — {p.totalPrice}</span>
                              </div>
                            </div>
                            <span className="text-xs text-zinc-600">{new Date(p.approvedAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rejected */}
                  {purchases.filter((p) => p.status === "rejected").length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><XCircle size={14} /> رد شده ({purchases.filter((p) => p.status === "rejected").length})</h3>
                      <div className="space-y-2">
                        {purchases.filter((p) => p.status === "rejected").map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 opacity-60">
                            <div className="flex items-center gap-3">
                              <XCircle size={16} className="text-red-400" />
                              <div>
                                <span className="text-sm text-white">{p.userName}</span>
                                <span className="text-xs text-zinc-500 mr-2">{p.planType === "volume" ? `${p.gigabytes} گیگ` : "نامحدود"}</span>
                                {p.rejectReason && <span className="text-xs text-red-400 mr-2">— {p.rejectReason}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-2">مدیریت ادمین‌ها</h2>
              <p className="text-zinc-500 text-sm mb-6">ادمین‌ها رو مدیریت کن و سطح دسترسی هر کدوم رو تنظیم کن.</p>

              {/* Role descriptions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { role: "owner", label: "مالک", desc: "دسترسی کامل", color: "amber" },
                  { role: "editor", label: "ویرایشگر", desc: "ویرایش محتوا", color: "cyan" },
                  { role: "support", label: "پشتیبانی", desc: "پاسخ به تیکت", color: "emerald" },
                  { role: "purchases", label: "خریدها", desc: "تایید خرید", color: "purple" },
                ].map((r) => (
                  <div key={r.role} className={`p-3 rounded-xl bg-${r.color}-400/5 border border-${r.color}-400/10 text-center`}>
                    <div className={`text-sm font-bold text-${r.color}-400`}>{r.label}</div>
                    <div className="text-[10px] text-zinc-500">{r.desc}</div>
                  </div>
                ))}
              </div>

              {/* Add Admin */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">افزودن ادمین جدید</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50" placeholder="نام" />
                  <input value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono ltr text-left focus:outline-none focus:border-cyan-400/50" placeholder="نام کاربری" dir="ltr" />
                  <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50" placeholder="رمز عبور" />
                  <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50">
                    <option value="support">پشتیبانی</option>
                    <option value="purchases">تایید خرید</option>
                    <option value="editor">ویرایشگر</option>
                  </select>
                </div>
                <button onClick={handleCreateAdmin} disabled={!newAdmin.username || !newAdmin.password || !newAdmin.name} className="mt-3 px-5 py-2.5 rounded-xl bg-cyan-400/10 text-cyan-400 text-sm font-medium hover:bg-cyan-400/20 transition-all disabled:opacity-50">
                  <Plus size={14} className="inline ml-1" /> افزودن
                </button>
              </div>

              {/* Admin List */}
              <div className="space-y-2">
                {adminList.map((admin) => (
                  <div key={admin.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-white">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{admin.name}</div>
                        <div className="text-xs text-zinc-500 font-mono" dir="ltr">{admin.username}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        admin.role === "owner" ? "bg-amber-400/10 text-amber-400" :
                        admin.role === "editor" ? "bg-cyan-400/10 text-cyan-400" :
                        admin.role === "support" ? "bg-emerald-400/10 text-emerald-400" :
                        "bg-purple-400/10 text-purple-400"
                      }`}>
                        {admin.role === "owner" ? "مالک" : admin.role === "editor" ? "ویرایشگر" : admin.role === "support" ? "پشتیبانی" : "تایید خرید"}
                      </span>
                      {admin.id !== "owner" && (
                        <button onClick={() => handleDeleteAdmin(admin.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مدیریت کاربران</h2>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all">
                  <RotateCcw size={16} /> بروزرسانی
                </button>
              </div>

              {userList.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>هنوز کاربری ثبت‌نام نکرده.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userList.map((u) => (
                    <div key={u.id} className="glass rounded-2xl overflow-hidden">
                      {/* User Header - Clickable */}
                      <button
                        onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                        className="w-full p-5 flex items-center gap-4 text-right hover:bg-white/[0.02] transition-all"
                      >
                        <img src={u.avatar} alt="" className="w-12 h-12 rounded-xl bg-white/10 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">{u.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">
                              {u.provider === "google" ? "گوگل" : "ایمیل"}
                            </span>
                            {u.stats.activeSubscriptions > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                                {u.stats.activeSubscriptions} اشتراک فعال
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 ltr" dir="ltr">{u.email || u.phone || "—"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2 text-center">
                            <div className="px-2 py-1 rounded-lg bg-emerald-400/5">
                              <div className="text-sm font-bold text-emerald-400">{u.stats.activeSubscriptions}</div>
                            </div>
                            <div className="px-2 py-1 rounded-lg bg-amber-400/5">
                              <div className="text-sm font-bold text-amber-400">{u.stats.pendingPurchases}</div>
                            </div>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`text-zinc-500 transition-transform duration-300 ${expandedUser === u.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedUser === u.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-white/5 pt-4">
                              {/* User Details */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white/[0.02]">
                                  <div className="text-[10px] text-zinc-500 mb-1">ایمیل</div>
                                  <div className="text-xs text-white ltr" dir="ltr">{u.email || "—"}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02]">
                                  <div className="text-[10px] text-zinc-500 mb-1">تلفن</div>
                                  <div className="text-xs text-white ltr" dir="ltr">{u.phone || "—"}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02]">
                                  <div className="text-[10px] text-zinc-500 mb-1">عضویت</div>
                                  <div className="text-xs text-white">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02]">
                                  <div className="text-[10px] text-zinc-500 mb-1">روش ثبت‌نام</div>
                                  <div className="text-xs text-white">{u.provider === "google" ? "گوگل" : "ایمیل/تلفن"}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Active Subscriptions - Always visible */}
                      {u.activeSubscriptions.length > 0 && (
                        <div className="px-5 pb-5">
                          <p className="text-xs text-zinc-500 mb-2">اشتراک‌های فعال:</p>
                          <div className="space-y-2">
                            {u.activeSubscriptions.map((sub) => (
                              <div key={sub.id} className="p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    <span className="text-sm text-white">{sub.planType === "volume" ? `حجمی — ${sub.gigabytes} گیگ` : "نامحدود ماهانه"}</span>
                                    <span className="text-xs text-zinc-500">{sub.totalPrice}</span>
                                    <span className="text-[10px] text-zinc-600">تایید: {new Date(sub.approvedAt).toLocaleDateString("fa-IR")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      id={`reason-${sub.id}`}
                                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] w-40 focus:outline-none focus:border-red-400/50"
                                      placeholder="دلیل لغو..."
                                    />
                                    <button
                                      onClick={() => {
                                        const reasonInput = document.getElementById(`reason-${sub.id}`) as HTMLInputElement;
                                        const reason = reasonInput?.value || "بدون توضیح";
                                        handleDeactivateSubWithReason(sub.id, reason);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-[11px] font-medium hover:bg-red-400/20 transition-all"
                                    >
                                      لغو اشتراک
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (() => {
            const now = new Date();
            const today = now.toISOString().slice(0, 10);
            const thisMonth = now.toISOString().slice(0, 7);
            const thisYear = now.toISOString().slice(0, 4);
            const todayPurchases = purchases.filter((p) => p.createdAt.slice(0, 10) === today);
            const monthPurchases = purchases.filter((p) => p.createdAt.slice(0, 7) === thisMonth);
            const yearPurchases = purchases.filter((p) => p.createdAt.slice(0, 4) === thisYear);
            const approvedPurchases = purchases.filter((p) => p.status === "approved");
            const pendingPurchases = purchases.filter((p) => p.status === "pending");
            const uniqueUsers = new Set(purchases.map((p) => p.userId)).size;
            const activeUsers = new Set(approvedPurchases.map((p) => p.userId)).size;
            const parsePriceNum = (s: string): number => {
              const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
              let cleaned = s.replace(/[^۰-۹0-9]/g, "");
              let num = "";
              for (const ch of cleaned) {
                const idx = persianDigits.indexOf(ch);
                num += idx !== -1 ? String(idx) : ch;
              }
              return parseInt(num, 10) || 0;
            };
            const todayRevenue = todayPurchases.filter((p) => p.status === "approved").reduce((acc, p) => acc + parsePriceNum(p.totalPrice), 0);
            const monthRevenue = monthPurchases.filter((p) => p.status === "approved").reduce((acc, p) => acc + parsePriceNum(p.totalPrice), 0);
            const yearRevenue = yearPurchases.filter((p) => p.status === "approved").reduce((acc, p) => acc + parsePriceNum(p.totalPrice), 0);

            return (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">آمار کاربران و فروش</h2>

                {/* Revenue Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "فروش امروز", value: todayRevenue.toLocaleString("fa-IR") + " تومان", count: todayPurchases.length, color: "cyan" },
                    { label: "فروش این ماه", value: monthRevenue.toLocaleString("fa-IR") + " تومان", count: monthPurchases.length, color: "purple" },
                    { label: "فروش امسال", value: yearRevenue.toLocaleString("fa-IR") + " تومان", count: yearPurchases.length, color: "emerald" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-2xl p-5">
                      <div className={`text-xs text-${stat.color}-400 mb-2`}>{stat.label}</div>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-zinc-500 mt-1">{stat.count} تراکنش</div>
                    </div>
                  ))}
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "کل کاربران خریدار", value: uniqueUsers, color: "cyan" },
                    { label: "اشتراک فعال", value: activeUsers, color: "emerald" },
                    { label: "در انتظار تایید", value: pendingPurchases.length, color: "amber" },
                    { label: "کل تراکنش‌ها", value: purchases.length, color: "purple" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                      <div className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</div>
                      <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* All Purchases List */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">لیست تمام خریدها</h3>
                  {purchases.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 glass rounded-2xl">هنوز خریدی ثبت نشده.</div>
                  ) : (
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">کاربر</th>
                              <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">پلن</th>
                              <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">مبلغ</th>
                              <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">وضعیت</th>
                              <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium">تاریخ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
                              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-white">{p.userName}</td>
                                <td className="px-4 py-3 text-zinc-400">{p.planType === "volume" ? `حجمی ${p.gigabytes}گیگ` : "نامحدود"}</td>
                                <td className="px-4 py-3 text-zinc-400">{p.totalPrice}</td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "approved" ? "bg-emerald-400/10 text-emerald-400" : p.status === "rejected" ? "bg-red-400/10 text-red-400" : "bg-amber-400/10 text-amber-400"}`}>
                                    {p.status === "approved" ? "تایید" : p.status === "rejected" ? "رد" : "در انتظار"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(p.createdAt).toLocaleDateString("fa-IR")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">پشتیبانی کاربران</h2>
                <button onClick={fetchSupportMessages} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all">
                  <RotateCcw size={16} /> بروزرسانی
                </button>
              </div>

              {supportMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>هنوز پیامی وجود نداره.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Thread List */}
                  <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
                    {supportMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => { setSelectedThread(msg.id); setAdminReply(""); }}
                        className={`w-full text-right p-4 rounded-xl transition-all ${
                          selectedThread === msg.id
                            ? "bg-cyan-400/10 border border-cyan-400/20"
                            : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">{msg.category}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${msg.status === "open" ? "bg-emerald-400/10 text-emerald-400" : "bg-zinc-700 text-zinc-400"}`}>
                            {msg.status === "open" ? "باز" : "بسته"}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-white mt-1">{msg.subject}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{msg.userName} — {msg.userEmail || msg.userName}</p>
                      </button>
                    ))}
                  </div>

                  {/* Chat View + User Info */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedThread ? (() => {
                      const thread = supportMessages.find((m) => m.id === selectedThread);
                      if (!thread) return <div className="text-zinc-500 text-center py-12">تیکت انتخاب نشده</div>;
                      return (
                        <>
                          {/* User Info Card */}
                          {selectedUserInfo && (
                            <div className="glass rounded-2xl p-5">
                              <div className="flex items-start gap-4">
                                <img src={selectedUserInfo.user.avatar} alt="" className="w-12 h-12 rounded-xl bg-white/10" />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-white">{selectedUserInfo.user.name}</h3>
                                  <p className="text-xs text-zinc-500 ltr" dir="ltr">{selectedUserInfo.user.email || "بدون ایمیل"}</p>
                                  <p className="text-xs text-zinc-500 ltr" dir="ltr">{selectedUserInfo.user.phone || "بدون تلفن"}</p>
                                </div>
                                <div className="text-left">
                                  <span className="text-[10px] text-zinc-600 block">عضویت</span>
                                  <span className="text-xs text-zinc-400">{new Date(selectedUserInfo.user.createdAt).toLocaleDateString("fa-IR")}</span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                {[
                                  { label: "تیکت باز", value: selectedUserInfo.stats.openTickets, color: "emerald" },
                                  { label: "تیکت بسته", value: selectedUserInfo.stats.closedTickets, color: "zinc" },
                                  { label: "کل تیکت‌ها", value: selectedUserInfo.stats.totalMessages, color: "cyan" },
                                  { label: "پاسخ ادمین", value: selectedUserInfo.stats.totalReplies, color: "purple" },
                                ].map((stat) => (
                                  <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className={`text-lg font-bold text-${stat.color}-400`}>{stat.value}</div>
                                    <div className="text-[10px] text-zinc-500">{stat.label}</div>
                                  </div>
                                ))}
                              </div>

                              {/* All tickets */}
                              {selectedUserInfo.tickets.length > 1 && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                  <h4 className="text-xs text-zinc-500 mb-2">تمام تیکت‌های این کاربر:</h4>
                                  <div className="space-y-1.5">
                                    {selectedUserInfo.tickets.map((t) => (
                                      <button
                                        key={t.id}
                                        onClick={() => setSelectedThread(t.id)}
                                        className={`w-full text-right flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                                          t.id === selectedThread ? "bg-cyan-400/10 text-cyan-400" : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.04]"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === "open" ? "bg-emerald-400" : "bg-zinc-600"}`} />
                                          <span>{t.subject}</span>
                                          <span className="text-zinc-600">({t.messageCount} پیام)</span>
                                        </div>
                                        <span className="text-zinc-600">{new Date(t.lastTime).toLocaleDateString("fa-IR")}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Chat */}
                          <div className="glass rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-white">{thread.subject}</h3>
                                <p className="text-xs text-zinc-500">{thread.category}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {thread.status === "open" && (
                                  <button onClick={() => handleCloseThread(thread.id)} className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs hover:bg-red-400/20 transition-all">بستن تیکت</button>
                                )}
                              </div>
                            </div>
                            <div className="h-80 overflow-y-auto p-4 space-y-3">
                              {thread.messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "admin" ? "bg-cyan-400/10 text-cyan-100 rounded-bl-sm" : "bg-white/5 text-zinc-300 rounded-br-sm"}`}>
                                    <p className="text-[10px] text-zinc-500 mb-1">{msg.sender === "admin" ? "ادمین" : thread.userName}</p>
                                    {msg.text}
                                    <span className="text-[10px] text-zinc-600 mt-1 block">{new Date(msg.time).toLocaleTimeString("fa-IR")}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {thread.status === "open" && (
                              <div className="p-4 border-t border-white/5 flex gap-2">
                                <input value={adminReply} onChange={(e) => setAdminReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdminReply(thread.id)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="پاسخ..." />
                                <button onClick={() => handleAdminReply(thread.id)} disabled={!adminReply} className="px-4 py-2.5 rounded-xl bg-cyan-400 text-black disabled:opacity-50 transition-all"><Send size={16} /></button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })() : (
                      <div className="text-center py-16 text-zinc-500 glass rounded-2xl">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>یه تیکت رو انتخاب کن</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-2">امنیت و مسیر مخفی پنل</h2>

              {/* Password Change */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">تغییر اطلاعات ورود مالک</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input value={ownerPassChange.newUsername} onChange={(e) => setOwnerPassChange({ ...ownerPassChange, newUsername: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono ltr text-left focus:outline-none focus:border-cyan-400/50" placeholder="یوزرنیم جدید" dir="ltr" />
                  <input type="password" value={ownerPassChange.current} onChange={(e) => setOwnerPassChange({ ...ownerPassChange, current: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50" placeholder="رمز فعلی" />
                  <input type="password" value={ownerPassChange.newPass} onChange={(e) => setOwnerPassChange({ ...ownerPassChange, newPass: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50" placeholder="رمز جدید (اختیاری)" />
                </div>
                <button
                  onClick={async () => {
                    if (!ownerPassChange.current) return;
                    if (!ownerPassChange.newUsername && !ownerPassChange.newPass) return;
                    try {
                      const res = await fetch("/api/admin/admins", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Basic ${token}` },
                        body: JSON.stringify({ id: "owner", username: ownerPassChange.newUsername || undefined, password: ownerPassChange.newPass || undefined }),
                      });
                      if (res.ok) {
                        setOwnerPassChange({ current: "", newPass: "", newUsername: "" });
                        alert("اطلاعات تغییر کرد! برای استفاده از یوزرنیم جدید دوباره وارد شوید.");
                      }
                    } catch {}
                  }}
                  disabled={!ownerPassChange.current || (!ownerPassChange.newUsername && !ownerPassChange.newPass)}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-amber-400/10 text-amber-400 text-sm font-medium hover:bg-amber-400/20 transition-all disabled:opacity-50"
                >
                  تغییر رمز عبور
                </button>
              </div>

              {/* Telegram ID */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">ایدی تلگرام پشتیبانی</h3>
                <p className="text-xs text-zinc-500 mb-3">ایدی تلگرام خود را وارد کنید تا کاربران بتونن مستقیم پیام بدن.</p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                    <input
                      value={data?.telegramId || ""}
                      onChange={(e) => { if (data) setData({ ...data, telegramId: e.target.value }); }}
                      className="w-full pl-4 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono ltr text-left focus:outline-none focus:border-cyan-400/50 transition-all"
                      placeholder="your_username"
                      dir="ltr"
                    />
                  </div>
                </div>
                {data?.telegramId && (
                  <p className="text-xs text-emerald-400 mt-2">
                    لینک: <a href={`https://t.me/${data.telegramId}`} target="_blank" rel="noopener noreferrer" className="underline">t.me/{data.telegramId}</a>
                  </p>
                )}
              </div>

              <p className="text-zinc-500 text-sm">
                با تنظیم مسیر مخفی، آدرس <code className="px-2 py-0.5 rounded bg-white/5 text-cyan-400">/admin</code> غیرفعال می‌شه و فقط با آدرس اختصاصی خودت قابل دسترسه.
              </p>

              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300 mb-1">نکته امنیتی</h4>
                    <p className="text-xs text-amber-400/70 leading-relaxed">
                      آدرس مخفی خود را در جای امنی ذخیره کنید. پس از ذخیره، برای اعمال تغییرات مسیر باید سرور را ری‌استارت کنید.
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
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[/\\?#]/g, "").replace(/\s/g, "");
                          updateField("adminRoute", cleaned);
                        }}
                        className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                        placeholder="مثلاً: xK9mP2"
                      />
                    </div>
                    <button
                      onClick={() => updateField("adminRoute", generateRandomRoute())}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all text-sm font-medium"
                    >
                      <RefreshCw size={16} /> تصادفی
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">فقط حروف انگلیسی و اعداد. بدون `/`، `?`، `#` و فاصله.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-500 mb-3">آدرس فعلی پنل مدیریت:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-400/5 border border-cyan-400/10 text-cyan-400 font-mono text-sm ltr text-left">
                      {typeof window !== "undefined" ? window.location.origin : ""}/{data.adminRoute}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${data.adminRoute}`)}
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
                    <code className="flex-1 px-4 py-2.5 rounded-lg bg-red-400/5 border border-red-400/10 text-red-400/60 font-mono text-sm line-through ltr text-left">
                      {typeof window !== "undefined" ? window.location.origin : ""}/admin
                    </code>
                    <span className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-medium">مسدود</span>
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
                    سرور رو ری‌استارت کنید تا مسیر مخفی فعال بشه
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۴.</span>
                    از این به بعد فقط با آدرس <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 ltr">/{data.adminRoute}</code> وارد پنل بشید
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">۵.</span>
                    کسی که آدرس <code className="px-1.5 py-0.5 rounded bg-white/5 text-red-400 ltr">/admin</code> رو باز کنه، ریدایرکت می‌شه
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/5">
            <AnimatePresence>
              {saved && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-400 flex items-center gap-1">
                  <Check size={16} /> ذخیره شد
                </motion.span>
              )}
            </AnimatePresence>
            <button onClick={fetchData} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 glass hover:bg-white/5 hover:text-white transition-all">
              <RotateCcw size={16} /> بازنشانی
            </button>
            <button onClick={saveData} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50">
              <Save size={16} /> {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
      </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {viewReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewReceipt(null)}
                className="absolute -top-12 left-0 text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                <X size={16} /> بستن
              </button>
              <img src={viewReceipt} alt="رسید پرداخت" className="rounded-2xl max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── صفحه اصلی ادمین ─── */
export default function AdminSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [token, setToken] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: SiteData) => {
        if (data.adminRoute === slug) {
          setValid(true);
          const saved = localStorage.getItem("admin_token");
          if (saved) setToken(saved);
        } else {
          setValid(false);
        }
      })
      .catch(() => setValid(false));
  }, [slug]);

  if (valid === null) {
    return (
      <div className="min-h-screen bg-[#06060b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!valid) {
    notFound();
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

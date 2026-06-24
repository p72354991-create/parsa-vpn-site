"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Package, MessageCircle, User, CreditCard, CheckCircle, Clock, XCircle, ExternalLink, Server, Link as LinkIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UserData { id: string; name: string; email: string; phone: string; avatar: string; }
interface Purchase { id: string; planType: string; gigabytes: number; totalPrice: string; status: string; rejectReason: string; subscriptionLink: string; createdAt: string; approvedAt: string; }
interface Message { id: string; category: string; subject: string; status: string; messages: { sender: string; text: string; time: string }[]; createdAt: string; }

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Check for Google OAuth redirect params
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get("token");
    const googleUser = params.get("user");

    if (googleToken && googleUser) {
      localStorage.setItem("user_token", googleToken);
      localStorage.setItem("user_data", googleUser);
      window.history.replaceState({}, "", "/dashboard");
    }

    const saved = localStorage.getItem("user_data");
    const token = localStorage.getItem("user_token");
    if (!saved || !token) { window.location.href = "/login"; return; }
    setUser(JSON.parse(saved));
    fetch("/api/support", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { if (Array.isArray(d)) setMessages(d); }).catch(() => {});
    fetch("/api/purchases", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { if (Array.isArray(d)) setPurchases(d); }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    window.location.href = "/";
  };

  if (!user) return <div className="min-h-screen bg-[#06060b] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;

  const openChats = messages.filter((m) => m.status === "open");
  const approvedPurchases = purchases.filter((p) => p.status === "approved");
  const pendingPurchases = purchases.filter((p) => p.status === "pending");
  const rejectedPurchases = purchases.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-screen bg-[#06060b]">
      <header className="glass-strong border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-white glass hover:bg-white/5 transition-all">
              <ArrowRight size={16} /> بازگشت به سایت
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-cyan-400" />
              <span className="font-bold"><span className="bg-gradient-to-l from-cyan-400 to-cyan-200 bg-clip-text text-transparent">pArSa</span><span className="text-zinc-400 font-light mr-1">VPN</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-white/10" />
              <span className="text-sm text-white hidden sm:block">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">سلام {user.name} 👋</h1>
          <p className="text-zinc-500">به داشبورد خودت خوش اومدی</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Package size={20} />, label: "اشتراک فعال", value: String(approvedPurchases.length), color: "emerald" },
            { icon: <Clock size={20} />, label: "در انتظار تایید", value: String(pendingPurchases.length), color: "amber" },
            { icon: <MessageCircle size={20} />, label: "چت باز", value: String(openChats.length), color: "cyan" },
            { icon: <CreditCard size={20} />, label: "کل خریدها", value: String(purchases.length), color: "purple" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-400/10 text-${stat.color}-400 flex items-center justify-center mb-3`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Subscriptions */}
        {approvedPurchases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Server size={18} className="text-emerald-400" /> اشتراک‌های فعال</h2>
            <div className="space-y-3">
              {approvedPurchases.map((p) => (
                <div key={p.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-400" />
                      <span className="font-bold text-white">{p.planType === "volume" ? `حجمی — ${p.gigabytes} گیگ` : "نامحدود ماهانه"}</span>
                    </div>
                    <span className="text-xs text-zinc-500">تایید شده {new Date(p.approvedAt).toLocaleDateString("fa-IR")}</span>
                  </div>
                  {p.subscriptionLink ? (
                    <div className="p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                      <p className="text-xs text-emerald-400 mb-2">لینک اشتراک شما:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-emerald-300 text-xs font-mono ltr text-left truncate" dir="ltr">{p.subscriptionLink}</code>
                        <a
                          href={p.subscriptionLink.startsWith("http") ? p.subscriptionLink : `https://${p.subscriptionLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">لینک اشتراک هنوز ارسال نشده.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Purchases */}
        {pendingPurchases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-amber-400" /> در انتظار تایید</h2>
            <div className="space-y-3">
              {pendingPurchases.map((p) => (
                <div key={p.id} className="glass rounded-2xl p-5 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-400" />
                      <span className="text-white">{p.planType === "volume" ? `حجمی — ${p.gigabytes} گیگ` : "نامحدود ماهانه"}</span>
                      <span className="text-xs text-zinc-500">{p.totalPrice}</span>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">در انتظار</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Purchases */}
        {rejectedPurchases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><XCircle size={18} className="text-red-400" /> اشتراک‌های لغو شده</h2>
            <div className="space-y-3">
              {rejectedPurchases.map((p) => (
                <div key={p.id} className="glass rounded-2xl p-5 border border-red-400/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle size={16} className="text-red-400" />
                      <span className="text-white">{p.planType === "volume" ? `حجمی — ${p.gigabytes} گیگ` : "نامحدود ماهانه"}</span>
                      <span className="text-xs text-zinc-500">{p.totalPrice}</span>
                    </div>
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">لغو شده</span>
                  </div>
                  {p.rejectReason && (
                    <div className="mt-2 p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                      <p className="text-xs text-zinc-500 mb-1">دلیل لغو:</p>
                      <p className="text-sm text-red-300">{p.rejectReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/support" className="glass rounded-2xl p-6 hover:bg-white/[0.03] transition-all group">
            <MessageCircle className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white mb-1">پشتیبانی</h3>
            <p className="text-sm text-zinc-500">با تیم پشتیبانی چت کن</p>
          </Link>
          <Link href="/#pricing" className="glass rounded-2xl p-6 hover:bg-white/[0.03] transition-all group">
            <CreditCard className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white mb-1">خرید اشتراک</h3>
            <p className="text-sm text-zinc-500">پلن مناسب خودت رو انتخاب کن</p>
          </Link>
        </div>

        {/* User Info */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User size={18} /> اطلاعات اکانت</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5"><span className="text-zinc-500">نام</span><span className="text-white">{user.name}</span></div>
            <div className="flex justify-between py-2 border-b border-white/5"><span className="text-zinc-500">ایمیل</span><span className="text-white ltr" dir="ltr">{user.email || "—"}</span></div>
            <div className="flex justify-between py-2"><span className="text-zinc-500">تلفن</span><span className="text-white ltr" dir="ltr">{user.phone || "—"}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

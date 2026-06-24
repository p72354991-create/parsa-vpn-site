"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Send, MessageCircle, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UserData { id: string; name: string; email: string; }
interface Message { id: string; category: string; subject: string; status: string; messages: { sender: string; text: string; time: string }[]; createdAt: string; }

const CATEGORIES = [
  { id: "purchase", label: "خرید و پرداخت", icon: "💳", questions: ["نحوه خرید اشتراک", "مشکل در پرداخت", "استرداد وجه"] },
  { id: "technical", label: "فنی و اتصال", icon: "🔧", questions: ["مشکل اتصال", "کندی سرعت", "قطعی سرور", "تنظیم اپلیکیشن"] },
  { id: "account", label: "اکانت و اشتراک", icon: "👤", questions: ["تغییر رمز", "تمدید اشتراک", "وضعیت اشتراک"] },
  { id: "general", label: "عمومی", icon: "💬", questions: ["پیشنهاد و انتقاد", "همکاری", "سایر"] },
];

export default function SupportPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const res = await fetch("/api/support", { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (Array.isArray(d)) setMessages(d);
    } catch {}
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user_data");
    const token = localStorage.getItem("user_token");
    if (saved) setUser(JSON.parse(saved));
    tokenRef.current = token;
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("thread");
    if (tid) setThreadId(tid);
    if (token) fetchMessages();
  }, [fetchMessages]);

  // Auto-poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, threadId]);

  const currentThread = messages.find((m) => m.id === threadId);

  const handleNewTicket = async () => {
    if (!selectedCat || !subject || !text) return;
    const token = tokenRef.current;
    if (!token) return;
    setSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: CATEGORIES.find((c) => c.id === selectedCat)?.label, subject, text }),
      });
      const msg = await res.json();
      if (msg.id) {
        // If it returned an existing thread, use it; otherwise add new
        setMessages((prev) => {
          const exists = prev.find((m) => m.id === msg.id);
          if (exists) return prev.map((m) => m.id === msg.id ? { ...m, messages: msg.messages } : m);
          return [...prev, msg];
        });
        setThreadId(msg.id);
        setSelectedCat(null); setSubject(""); setText("");
        // Re-fetch to get full thread data
        setTimeout(fetchMessages, 500);
      }
    } catch {} finally { setSending(false); }
  };

  const handleReply = async () => {
    if (!replyText || !threadId) return;
    const token = tokenRef.current;
    if (!token) return;
    const msgText = replyText;
    setReplyText("");
    setSending(true);
    // Optimistic update
    setMessages((prev) => prev.map((m) => m.id === threadId ? { ...m, messages: [...m.messages, { sender: "user", text: msgText, time: new Date().toISOString() }] } : m));
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messageId: threadId, text: msgText }),
      });
    } catch {} finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-[#06060b]">
      <header className="glass-strong border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-bold"><span className="bg-gradient-to-l from-cyan-400 to-cyan-200 bg-clip-text text-transparent">pArSa</span><span className="text-zinc-400 font-light mr-1">VPN</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {user && <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">داشبورد</Link>}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!user ? (
          <div className="text-center py-20">
            <MessageCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">برای پیام دادن وارد شو</h2>
            <p className="text-zinc-500 mb-6">اول باید اکانت داشته باشی تا بتونی به پشتیبانی پیام بدی.</p>
            <div className="flex justify-center gap-3">
              <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 text-black font-semibold text-sm">ورود</Link>
              <Link href="/register" className="px-6 py-3 rounded-xl glass text-zinc-400 hover:text-white transition-all text-sm">ثبت‌نام</Link>
            </div>
          </div>
        ) : threadId && currentThread ? (
          /* Chat View */
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <button onClick={() => setThreadId(null)} className="text-xs text-cyan-400 hover:text-cyan-300 mb-1 flex items-center gap-1"><ArrowRight size={12} /> بازگشت</button>
                <h3 className="font-bold text-white">{currentThread.subject}</h3>
                <span className="text-xs text-zinc-500">{currentThread.category}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${currentThread.status === "open" ? "bg-emerald-400/10 text-emerald-400" : "bg-zinc-700 text-zinc-400"}`}>
                {currentThread.status === "open" ? "باز" : "بسته"}
              </span>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {currentThread.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-white/5 text-zinc-300 rounded-br-sm" : "bg-cyan-400/10 text-cyan-100 rounded-bl-sm"}`}>
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-zinc-600 mt-1 block">{new Date(msg.time).toLocaleTimeString("fa-IR")}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>
            {currentThread.status === "open" && (
              <div className="p-4 border-t border-white/5 flex gap-2">
                <input value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleReply()} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="پیام خود رو بنویسید..." />
                <button onClick={handleReply} disabled={sending || !replyText} className="px-4 py-3 rounded-xl bg-cyan-400 text-black disabled:opacity-50 transition-all"><Send size={18} /></button>
              </div>
            )}
          </div>
        ) : (
          /* New Ticket */
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">پشتیبانی</h2>
            <p className="text-zinc-500 mb-8">دسته‌بندی سوالت رو انتخاب کن و پیام بده.</p>

            {/* Open threads */}
            {messages.filter((m) => m.status === "open").length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">چت‌های باز شما</h3>
                <div className="space-y-2">
                  {messages.filter((m) => m.status === "open").map((msg) => (
                    <button key={msg.id} onClick={() => setThreadId(msg.id)} className="w-full text-right glass rounded-xl p-4 hover:bg-white/[0.03] transition-all flex items-center justify-between">
                      <div>
                        <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">{msg.category}</span>
                        <h4 className="text-white font-medium mt-1">{msg.subject}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{msg.messages.length} پیام</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!selectedCat ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className="glass rounded-2xl p-6 text-right hover:bg-white/[0.03] transition-all group">
                    <span className="text-3xl mb-3 block">{cat.icon}</span>
                    <h3 className="font-bold text-white mb-2">{cat.label}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.questions.map((q) => (
                        <span key={q} className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{q}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-400">{CATEGORIES.find((c) => c.id === selectedCat)?.icon} {CATEGORIES.find((c) => c.id === selectedCat)?.label}</span>
                  <button onClick={() => setSelectedCat(null)} className="text-zinc-500 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="موضوع پیام" />
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none" placeholder="پیام خود رو بنویسید..." />
                <button onClick={handleNewTicket} disabled={sending || !subject || !text} className="px-6 py-3 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 text-black font-semibold text-sm disabled:opacity-50 transition-all">
                  {sending ? "در حال ارسال..." : "ارسال پیام"}
                </button>
              </div>
            )}

            {/* Previous tickets */}
            {messages.filter((m) => m.status === "closed").length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-white mb-4">تیکت‌های بسته شده</h3>
                <div className="space-y-3">
                  {messages.filter((m) => m.status === "closed").map((msg) => (
                    <button key={msg.id} onClick={() => setThreadId(msg.id)} className="w-full text-right glass rounded-xl p-4 hover:bg-white/[0.03] transition-all opacity-60">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-zinc-500">{msg.category}</span>
                          <h4 className="text-white font-medium">{msg.subject}</h4>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">بسته</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minus } from "lucide-react";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; token: string } | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [step, setStep] = useState<"category" | "subject" | "chat">("category");
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_data");
    const token = localStorage.getItem("user_token");
    if (saved && token) {
      const u = JSON.parse(saved);
      setUser({ id: u.id, name: u.name, token });
    }
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Poll messages when thread is open
  useEffect(() => {
    if (!threadId || !user) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/support?id=${threadId}`, { headers: { Authorization: `Bearer ${user.token}` } });
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [threadId, user]);

  const categories = [
    { id: "خرید و پرداخت", label: "خرید و پرداخت" },
    { id: "فنی و اتصال", label: "فنی و اتصال" },
    { id: "اکانت و اشتراک", label: "اکانت و اشتراک" },
    { id: "عمومی", label: "عمومی" },
  ];

  const handleStart = async () => {
    if (!user || !category || !subject) return;
    setSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ category, subject, text: `شروع گفتگو — ${subject}` }),
      });
      const msg = await res.json();
      if (msg.id) {
        setThreadId(msg.id);
        setMessages(msg.messages || []);
        setStep("chat");
      }
    } catch {} finally { setSending(false); }
  };

  const handleSend = async () => {
    if (!text || !threadId || !user) return;
    setSending(true);
    const newMsg = { sender: "user", text, time: new Date().toISOString() };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ messageId: threadId, text }),
      });
    } catch {} finally { setSending(false); }
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    if (user && !threadId) setStep("category");
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-[9998] w-14 h-14 rounded-full bg-gradient-to-l from-cyan-400 to-cyan-300 text-black shadow-lg shadow-cyan-400/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-[9999] w-[360px] max-w-[calc(100vw-3rem)]"
          >
            <div className="glass rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/5">
              {/* Header */}
              <div className="bg-gradient-to-l from-cyan-400/10 to-purple-400/10 p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                    <MessageCircle size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">پشتیبانی</h3>
                    <p className="text-[10px] text-zinc-500">آنلاین</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(!minimized)} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><Minus size={14} /></button>
                  <button onClick={() => setOpen(false)} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><X size={14} /></button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* Content */}
                  <div className="h-80 overflow-y-auto p-4">
                    {!user ? (
                      <div className="text-center py-8">
                        <p className="text-zinc-500 text-sm mb-3">برای پیام دادن وارد شو</p>
                        <a href="/login" className="inline-block px-4 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm font-medium hover:bg-cyan-400/20 transition-all">ورود</a>
                      </div>
                    ) : step === "category" ? (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500 mb-3">دسته‌بندی رو انتخاب کن:</p>
                        {categories.map((cat) => (
                          <button key={cat.id} onClick={() => { setCategory(cat.id); setStep("subject"); }} className="w-full text-right px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    ) : step === "subject" ? (
                      <div className="space-y-3">
                        <p className="text-xs text-zinc-500">موضوع پیام:</p>
                        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="مثلاً: مشکل اتصال" />
                        <button onClick={handleStart} disabled={!subject || sending} className="w-full py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-semibold disabled:opacity-50 transition-all">
                          {sending ? "..." : "شروع چت"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.sender === "user" ? "bg-white/5 text-zinc-300 rounded-br-sm" : "bg-cyan-400/10 text-cyan-100 rounded-bl-sm"}`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEnd} />
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  {user && step === "chat" && (
                    <div className="p-3 border-t border-white/5 flex gap-2">
                      <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="پیام..." />
                      <button onClick={handleSend} disabled={sending || !text} className="px-3 py-2.5 rounded-xl bg-cyan-400 text-black disabled:opacity-50 transition-all"><Send size={14} /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

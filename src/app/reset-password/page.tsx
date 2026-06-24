"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setMessage(data.message);
      if (data._devToken) setToken(data._devToken);
      setStep("reset");
    } catch { setError("خطا"); } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setMessage("رمز عبور با موفقیت تغییر کرد! حالا می‌تونی وارد بشی.");
    } catch { setError("خطا"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-cyan-400/5 rounded-full blur-[150px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">بازیابی رمز عبور</h1>
            <p className="text-zinc-500 text-sm">{step === "request" ? "ایمیلت رو وارد کن" : "رمز جدیدت رو بذار"}</p>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">ایمیل</label>
                <div className="relative">
                  <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="you@example.com" dir="ltr" required />
                </div>
              </div>
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {message && <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{message}</div>}
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50">
                {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {message.includes("موفقیت") ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400 text-sm mb-4">{message}</p>
                  <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 text-black font-semibold text-sm">
                    ورود به اکانت <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">توکن بازیابی</label>
                    <input value={token} onChange={(e) => setToken(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400/50 transition-all ltr text-left" placeholder="توکن ارسال شده به ایمیل" dir="ltr" required />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">رمز عبور جدید</label>
                    <div className="relative">
                      <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all" placeholder="حداقل ۶ کاراکتر" required minLength={6} />
                    </div>
                  </div>
                  {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-l from-cyan-400 to-cyan-300 text-black hover:shadow-lg hover:shadow-cyan-400/25 transition-all disabled:opacity-50">
                    {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
                  </button>
                </>
              )}
            </form>
          )}

          <p className="text-center text-sm text-zinc-500 mt-6">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">بازگشت به ورود</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

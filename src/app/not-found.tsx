import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-zinc-800 mb-4">404</h1>
        <p className="text-xl text-zinc-500 mb-8">این صفحه وجود نداره.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-300 text-black font-semibold text-sm hover:shadow-lg hover:shadow-cyan-400/25 transition-all"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

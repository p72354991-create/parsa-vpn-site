import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "pArSa VPN — اینترنت آزاد، امنیت بی‌نهایت",
  description:
    "تجربه اینترنت پرسرعت، امن و بدون سانسور با pArSa VPN. رمزنگاری نظامی، بدون ثبت لاگ و سرورهای جهانی.",
  keywords: ["VPN", "pArSa VPN", "امنیت", "حریم خصوصی", "بایپس فیلتر"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#06060b] text-zinc-200 font-[Vazirmatn]">
        {children}
      </body>
    </html>
  );
}

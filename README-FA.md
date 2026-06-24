# pArSa VPN — پنل مدیریت و فروش VPN

پروژه کامل و آماده استقرار برای راه‌اندازی کسب‌وکار فروش VPN.

## امکانات
- ✅ صفحه اصلی سایت با طراحی سایبرپانک
- ✅ پنل مدیریت حرفه‌ای (۱۰+ تب)
- ✅ سیستم ثبت‌نام و ورود (ایمیل + گوگل)
- ✅ سیستم خرید و تایید اشتراک
- ✅ چت پشتیبانی ریل‌تایم
- ✅ مدیریت چند ادمین با نقش‌های مختلف
- ✅ آمار فروش و کاربران
- ✅ مسیر مخفی پنل مدیریت
- ✅ ریسپانسیو کامل (موبایل + دسکتاپ)
- ✅ RTL فارسی با فونت وزیر

## نصب و راه‌اندازی

### ۱. نصب Node.js
از سایت `nodejs.org` نسخه LTS رو دانلود و نصب کنید.

### ۲. نصب وابستگی‌ها
```bash
npm install
```

### ۳. ساخت فایل .env.local
فایل `.env.example` رو کپی کنید و اسمش رو به `.env.local` تغییر بدید:
```bash
cp .env.example .env.local
```

### ۴. تنظیم متغیرها
فایل `.env.local` رو باز کنید و مقادیر رو تنظیم کنید:
```
ADMIN_USER=admin
ADMIN_PASS=your_password
ADMIN_SECRET=your_secret_route
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### ۵. اجرای پروژه
```bash
npm run dev
```
سایت روی `http://localhost:3000` اجرا می‌شه.

## اطلاعات ورود ادمین
- **آدرس پنل:** `http://localhost:3000/your_secret_route`
- **یوزرنیم:** `admin`
- **رمز عبور:** مقداری که توی `ADMIN_PASS` گذاشتید

## دپلوی روی هاست

### Netlify (رایگان)
1. فایل‌ها رو آپلود کنید
2. Build command: `npm run build`
3. Publish directory: `.next`

### VPS
```bash
npm install
npm run build
npm i -g pm2
pm2 start npm --name "parsa-vpn" -- start
pm2 save
pm2 startup
```

## نکات مهم
- فایل `src/data/site.json` تنظیمات سایت رو ذخیره می‌کنه
- فایل `src/data/db.json` اطلاعات کاربران و خریدها رو ذخیره می‌کنه
- فایل `.env.local` رو هرگز کامیت نکنید
- برای Google OAuth باید Google Cloud Console رو تنظیم کنید

## پشتیبانی
برای سوالات فنی با ما تماس بگیرید.

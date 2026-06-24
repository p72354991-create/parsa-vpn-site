# pArSa VPN — پنل مدیریت و فروش VPN

پروژه کامل و آماده استقرار روی سرور برای راه‌اندازی کسب‌وکار فروش VPN.

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

## نصب روی سرور (Ubuntu/Debian)

### ۱. نصب Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # باید v20.x باشه
```

### ۲. آپلود فایل‌ها
فایل `pArSa-VPN-Final.zip` رو روی سرور آپلود کنید و اکسترact کنید:
```bash
cd /var/www
unzip pArSa-VPN-Final.zip
mv pArSa-VPN-Final parsa-vpn
cd parsa-vpn
```

یا از لوکال آپلود کنید:
```bash
scp -r pArSa-VPN-Final.zip root@YOUR_SERVER_IP:/var/www/
ssh root@YOUR_SERVER_IP
cd /var/www
unzip pArSa-VPN-Final.zip
mv pArSa-VPN-Final parsa-vpn
```

### ۳. نصب وابستگی‌ها
```bash
cd /var/www/parsa-vpn
npm install
```

### ۴. ساخت فایل .env.local
```bash
cp .env.example .env.local
nano .env.local
```

مقدارها رو تنظیم کنید:
```
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here
ADMIN_SECRET=your_secret_route_here

# Google OAuth (اختیاری)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

### ۵. بیلد پروژه
```bash
npm run build
```

### ۶. اجرا با PM2 (برای بالا موندن)
```bash
npm install -g pm2
pm2 start npm --name "parsa-vpn" -- start
pm2 save
pm2 startup
```

### ۷. تنظیم Nginx (پیشنهادی)
فایل `/etc/nginx/sites-available/parsa-vpn`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/parsa-vpn /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### ۸. SSL با Let's Encrypt (اختیاری)
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

## دستورات کاربردی

| دستور | توضیح |
|-------|-------|
| `pm2 start npm --name "parsa-vpn" -- start` | اجرای پروژه |
| `pm2 restart parsa-vpn` | ری‌استارت |
| `pm2 stop parsa-vpn` | توقف |
| `pm2 logs parsa-vpn` | مشاهده لاگ‌ها |
| `pm2 status` | وضعیت پروژه |

## اطلاعات ورود ادمین
- **آدرس پنل:** `https://yourdomain.com/your_secret_route`
- **یوزرنیم:** مقدار `ADMIN_USER` توی `.env.local`
- **رمز عبور:** مقدار `ADMIN_PASS` توی `.env.local`

## ساختار فایل‌ها
```
parsa-vpn/
├── src/
│   ├── app/              ← صفحات سایت و API
│   ├── components/       ← کامپوننت‌ها
│   ├── data/
│   │   ├── site.json     ← تنظیمات سایت (قابل ویرایش از پنل)
│   │   └── db.json       ← دیتابیس (خودکار ساخته می‌شه)
│   ├── lib/              ← دیتابیس و ابزارها
│   └── middleware.ts
├── .env.local            ← متغیرهای محیطی
├── package.json
└── README.md
```

## نکات مهم
- فایل `db.json` خودکار ساخته می‌شه و اطلاعات کاربران و خریدها توش ذخیره می‌شه
- فایل `site.json` از پنل مدیریت قابل ویرایشه
- `.env.local` رو هرگز کامیت یا آپلود نکنید
- برای پشتیبانی، `db.json` و `site.json` رو بکاپ بگیرید
- دیتابیس فایلی هست و روی سرور ذخیره می‌مونه

## پشتیبانی
برای سوالات فنی با ما تماس بگیرید.

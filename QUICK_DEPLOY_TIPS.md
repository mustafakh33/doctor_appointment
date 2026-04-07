# 🚀 نصائح سريعة للنشر | Quick Deployment Tips

## تجهيز Backend قبل النشر

```bash
# 1. التحقق من أن جميع الـ dependencies مثبتة
cd backend
npm install

# 2. اختبار البناء المحلي
npm run build  # إن وجد

# 3. تشغيل server محلياً
npm run start:dev
# يجب أن تغلق البيانات: "App running on port 8000"

# 4. seed initial data (اختياري)
npm run seed
npm run seed:admin

# 5. إنشاء .env.production (للنشر)
cp .env .env.production
# ثم عدّل القيم للـ production
```

## تجهيز Frontend قبل النشر

```bash
# 1. التأكد من تثبيت المشاريع
cd frontend
npm install

# 2. بناء للـ production
npm run build
# يجب أن تنتهي بـ "✓ Compiled successfully"

# 3. اختبار الـ build محلياً
npm run start
# افتح http://localhost:3000

# 4. التحقق من environment variables
# تأكد أن .env.local موجودة و تحتوي على:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
echo "NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8000" >> .env.local
```

---

## قيم Environment Variables الافتراضية

### للـ Development (محلياً):

**backend/.env:**

```env
NODE_ENV=development
PORT=8000
DB_URI=mongodb+srv://...@....mongodb.net/doctor_appointment?retryWrites=true&w=majority
JWT_SECRET=dev-secret-key-not-secure-for-production
JWT_EXPIRE=7d
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env.local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### للـ Production (Vercel + Render):

**Backend (في Render Dashboard → Environment):**

```env
NODE_ENV=production
PORT=8000
DB_URI=mongodb+srv://...
JWT_SECRET=generate-strong-random-32-chars
EMAIL_USER=...
EMAIL_PASS=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Frontend (في Vercel Project Settings → Environment Variables):**

```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

---

## أوامر مهمة

### تشغيل وتطوير محلي:

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# ثم افتح http://localhost:3000
```

### بناء للـ Production:

```bash
# Frontend
cd frontend
npm run build  # إنشاء .next folder
npm run start  # اختبار الـ build

# Backend (لا يحتاج build عادة)
# لكن تأكد من تثبيت dependencies:
cd backend
npm install --production
```

### التحقق من نسخ الـ CLI tools:

```bash
# تأكد من GitHub CLI (لأتمتة deployment)
gh --version

# تأكد من Node و npm
node --version  # يجب v18+
npm --version   # يجب v9+
```

---

## Integration مع GitHub (اختياري لـ auto-deploy)

### 1. منع Commit من .env files:

```bash
# في جذر المشروع، أنشئ .gitignore:
*.env
*.env.local
*.env.*.local
node_modules/
.next/
dist/
uploads/
```

### 2. إضافة GitHub Actions للـ auto-test (اختياري):

**في المشروع، أنشئ `.github/workflows/test.yml`:**

```yaml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Test Frontend Build
        run: |
          cd frontend
          npm install
          npm run build

      - name: Lint Frontend
        run: |
          cd frontend
          npm run lint
```

---

## الخطوات التفصيلية للنشر على Vercel

### باستخدام Vercel CLI:

```bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر
cd frontend
vercel --prod

# سيسأل عن بعض الخيارات، اختر Default لـ معظمها
```

### أو يدويّاً عبر Dashboard:

1. انتقل إلى https://vercel.com/dashboard
2. انقر **Add New → Project**
3. اختر repo من GitHub
4. اختر root: `./frontend`
5. أضف Environment Variables
6. انقر **Deploy**

---

## الخطوات التفصيلية للنشر على Render

### الطريقة السهلة (ربط GitHub):

1. انتقل إلى https://dashboard.render.com
2. انقر **New → Web Service**
3. اختر **Connect to GitHub**
4. اختر repo و click **Connect**
5. أكمل الخيارات:
   - **Name:** `doctor-appointment-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. أضف Environment Variables
7. انقر **Create Web Service**

### الطريقة اليدويّة (Git URL):

```bash
git remote add render https://git.render.com/...
git push render main
```

---

## ملاحظات مهمة

⚠️ **الأمان:**

- لا تُcommit أي `*.env` files
- استخدم secrets في GitHub/Vercel/Render dashboards
- غيّر `JWT_SECRET` على production
- فعّل 2FA على جميع الحسابات

⚠️ **الأداء:**

- تأكد من تفعيل gzip compression
- استخدم CDN للـ static assets
- راقب database performance (MongoDB Atlas Monitoring)

⚠️ **Monitoring:**

- راقب الـ logs في Vercel و Render
- فعّل error tracking (مثل Sentry)
- راقب database quotas

---

**تم التحديث:** 8 أبريل 2026

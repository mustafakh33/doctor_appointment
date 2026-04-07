# 📦 أوامر سريعة | Quick Commands Reference

## تشغيل محلياً

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# ثم: http://localhost:3000
```

---

## بناء للنشر

```bash
# Frontend
cd frontend && npm run build

# Backend (التحقق فقط)
cd backend && npm install --production
```

---

## Environment Variables المختصرة

### Backend (Render)

```
NODE_ENV=production
PORT=8000
DB_URI=<من MongoDB Atlas>
JWT_SECRET=<32 chars عشوائي>
EMAIL_USER=<gmail>
EMAIL_PASS=<App Password>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=<Vercel URL>
CORS_ORIGIN=<Vercel URL>
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=<Render URL>/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=<Render URL>
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Pre-Deployment Checklist

- [ ] Frontend build ✅: `npm run build` بدون errors
- [ ] Backend running ✅: `npm run start:dev` بدون crashes
- [ ] Database connected ✅: MongoDB Atlas متصل
- [ ] Admin account ✅: `admin@doccura.local` / `Admin@123`
- [ ] Images loading ✅: صور اللوجن و الأطباء تحمل
- [ ] CORS configured ✅: Backend علم Frontend URL
- [ ] Env vars checked ✅: جميع المتغيرات موجودة و محدثة

---

## Post-Deployment Checklist

- [ ] Vercel deployment finished ✅
- [ ] Render deployment finished ✅
- [ ] Frontend loads ✅: https://your-vercel-app.vercel.app
- [ ] Backend responds ✅: https://your-render-app.onrender.com/api/v1/health
- [ ] Login works ✅: اختبر بـ admin account
- [ ] API calls work ✅: اختبر doctors list
- [ ] Images load ✅: صور من Backend
- [ ] Emails send ✅: اختبر reset password
- [ ] Payments work ✅: اختبر Stripe test mode

---

## Database Seed Commands

```bash
cd backend

# Seed all initial data
npm run seed

# Seed admin account only
npm run seed:admin

# Seed doctors
npm run seed:doctors

# Seed categories
npm run seed:categories

# Seed patients
npm run seed:patients
```

---

## Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Gmail App Passwords:** https://myaccount.google.com/apppasswords

---

## Troubleshooting Commands

```bash
# Check Node version
node --version  # should be v18+

# Check npm version
npm --version  # should be v9+

# Check if port 8000 is used
netstat -ano | findstr :8000  # Windows

# Test Backend health
curl http://localhost:8000/api/v1/health

# Test Frontend build
cd frontend && npm run build && npm run start

# Check git status
git status
git log --oneline -5
```

---

## أسرع طريق للنشر

1. **إعداد Render (10 دقائق):**
   - أنشئ حساب و Web Service
   - أضف Environment Variables
   - Deploy

2. **إعداد Vercel (5 دقائق):**
   - أنشئ حساب و import project
   - أضف Environment Variables
   - Deploy

3. **الاختبار (10 دقائق):**
   - اختبر login
   - اختبر doctor booking
   - اختبر payment

**Total: ~25 دقيقة** ✅

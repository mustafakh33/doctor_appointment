# 📋 Checklist النشر النهائي | Final Deployment Checklist

**آخر تحديث:** 8 أبريل 2026  
**حالة النشر:** جاهز للنشر ✅

---

## ▶️ المرحلة الأولى: إعداد Backend Hosting

### الخيار الموصى به: Render.com (الأسهل والأسرع)

> بدائل: Railway.com، Fly.io، Heroku

#### الخطوات:

1. **إنشاء حساب على Render.com**
   - انتقل إلى https://dashboard.render.com
   - سجل دخول أو أنشئ حساب جديد
   - ربط GitHub account (اختياري لـ auto-deploy)

2. **إنشاء Web Service**

   ```
   - New → Web Service
   - اختر "Deploy from GitHub" أو "Public Git Repository"
   - GitHub Repo: doctor_appointment/backend (أو التعديل حسب اسمك)
   - Name: doctor-appointment-api
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Instance Type: Free (كافي للـ MVP)
   ```

3. **تعيين Environment Variables**
   - اذهب إلى Web Service Settings → Environment
   - أضف المتغيرات التالية:

   ```env
   # Database
   DB_URI=mongodb+srv://<username>:<password>@ac-pq7r9ex-shard-00-02.6gh4a40.mongodb.net/doctor_appointment?retryWrites=true&w=majority

   # Server
   NODE_ENV=production
   PORT=8000

   # JWT
   JWT_SECRET=<generate-strong-32-char-random-string>
   # مثال آمن: jXkL9pQ2mN5bV8cD3fG1hA0Z7yR4sT6w

   # Email (SMTP)
   EMAIL_USER=<your-email@gmail.com>
   EMAIL_PASS=<your-app-password>
   # ملاحظة: في Gmail استخدم App Password، ليس الـ regular password

   # Stripe (للدفع)
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

   # Frontend URL (للـ CORS)
   FRONTEND_URL=https://<your-frontend-domain>.vercel.app
   ```

4. **التحقق من الاتصال**

   ```bash
   # سيظهر رابط مثل:
   https://doctor-appointment-api.onrender.com

   # اختبر الاتصال:
   curl https://doctor-appointment-api.onrender.com/api/v1/health
   ```

---

## ▶️ المرحلة الثانية: إعداد Frontend (Vercel)

### الخطوات:

1. **إنشاء حساب على Vercel**
   - انتقل إلى https://vercel.com
   - سجل دخول/أنشئ حساب
   - اربط GitHub account

2. **Import Project**

   ```
   - New Project
   - Select: doctor_appointment (repo)
   - Framework: Next.js 15
   - Root Directory: ./frontend
   ```

3. **إعداد Environment Variables**
   - Project Settings → Environment Variables
   - أضف المتغيرات:

   ```env
   # API Configuration (استخدم رابط Backend من Render)
   NEXT_PUBLIC_API_URL=https://doctor-appointment-api.onrender.com/api/v1

   # Asset Base URL (نفس رابط Backend)
   NEXT_PUBLIC_ASSET_BASE_URL=https://doctor-appointment-api.onrender.com
   ```

4. **Deploy**

   ```
   - انقر Deploy
   - سينتظر البناء (5-10 دقائق)
   - سيظهر رابط مثل:
     https://doctor-appointment-xxxxxxx.vercel.app
   ```

5. **تفعيل Custom Domain (اختياري)**
   ```
   - Project Settings → Domains
   - أضف نطاقك (مثل: doctorapp.com)
   - اتبع تعليمات DNS configuration
   ```

---

## ▶️ المرحلة الثالثة: التحقق والاختبار

### قائمة التحقق:

- [ ] **Backend يعمل:**

  ```bash
  curl https://doctor-appointment-api.onrender.com/api/v1/auth/login
  # يجب أن تأتي استجابة (200 أو error message مشروع)
  ```

- [ ] **Frontend يحمل:**

  ```
  https://doctor-appointment-xxxxxxx.vercel.app
  # يجب أن يحمل بدون أخطاء CORS
  ```

- [ ] **اختبر Login:**

  ```
  - Email: admin@doccura.local
  - Password: Admin@123
  - يجب أن تنجح عملية التسجيل
  ```

- [ ] **اختبر الصور:**

  ```
  - تأكد أن صور اللوجن تحمل بدون 404
  - تأكد أن صور الأطباء تحمل من Backend
  ```

- [ ] **اختبر API:**

  ```bash
  # الحصول على قائمة الأطباء
  curl https://doctor-appointment-api.onrender.com/api/v1/doctors
  # يجب أن تعود قائمة بـ JSON
  ```

- [ ] **التحقق من قاعدة البيانات:**
  ```
  - تسجيل مستخدم جديد
  - حجز موعد
  - التحقق من حفظ البيانات في MongoDB
  ```

---

## 🔧 Environment Variables المطلوبة

### Backend (.env أو Render Environment)

```env
# ========== SERVER CONFIG ==========
NODE_ENV=production
PORT=8000

# ========== DATABASE ==========
DB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/doctor_appointment?retryWrites=true&w=majority
# احصل على الرابط من MongoDB Atlas → Connect → Application

# ========== AUTHENTICATION ==========
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRE=7d

# ========== EMAIL CONFIG (Gmail) ==========
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App Password from Gmail
EMAIL_FROM=noreply@doctorapp.com

# ========== PAYMENT (Stripe) ==========
STRIPE_SECRET_KEY=sk_test_51xxx...
STRIPE_WEBHOOK_SECRET=whsec_1xxx...
# احصل عليها من Stripe Dashboard → Developers → API Keys

# ========== FRONTEND ==========
FRONTEND_URL=https://your-vercel-domain.vercel.app
CORS_ORIGIN=https://your-vercel-domain.vercel.app

# ========== FILE UPLOADS ==========
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### Frontend (Vercel Environment Variables)

```env
# ========== API URLs ==========
NEXT_PUBLIC_API_URL=https://doctor-appointment-api.onrender.com/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=https://doctor-appointment-api.onrender.com

# ========== STRIPE PUBLIC ==========
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51xxx...

# ========== APP CONFIG ==========
NEXT_PUBLIC_APP_NAME=Doctor Appointment
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

---

## 📝 خطوات ما بعد النشر

### 1. تحديث قاعدة البيانات

```bash
# في Backend environment
npm run seed  # لـ seed initial data
npm run seed:admin  # لـ seed admin account
```

### 2. التحقق من Logs

- **Vercel:** Project Dashboard → Deployments → Logs
- **Render:** Web Service → Logs

### 3. إعداد SSL/TLS

- Vercel يفعلها تلقائياً ✓
- Render يفعلها تلقائياً ✓

### 4. إعداد Monitoring (اختياري)

- Vercel Analytics
- Render monitoring
- Sentry error tracking

### 5. نسخ احتياطية لـ MongoDB

```
MongoDB Atlas → Backup
تفعيل Automated backups
```

---

## ⚠️ المشاكل الشائعة والحلول

### المشكلة: CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**الحل:**

- تأكد أن `CORS_ORIGIN` في Backend = رابط Frontend الصحيح
- أضف `FRONTEND_URL` في Backend .env

### المشكلة: 404 في الصور

```
GET /assets/img/doctor.jpg 404
```

**الحل:**

- تأكد أن `NEXT_PUBLIC_ASSET_BASE_URL` = رابط Backend الصحيح
- الصور موجودة في `/backend/uploads`

### المشكلة: Database Connection Timeout

```
MongoConnectionError: connection timed out
```

**الحل:**

- تحقق من IP Whitelist في MongoDB Atlas
- أضف IP address الـ Backend (Render/Railway)
- في MongoDB Atlas → Network Access → Add IP Address 0.0.0.0/0 (للـ Free tier فقط)

### المشكلة: Email Not Sending

```
Error: connect EAUTH
```

**الحل:**

- استخدم App Password من Gmail (ليس regular password)
- فعّل "Less secure app access" إن لزم الحال
- جرب SMTP مختلف (مثل SendGrid، Mailgun)

---

## ✅ قائمة التحقق النهائية

- [ ] Database متصل وعامل
- [ ] Backend يرد على API requests
- [ ] Frontend يحمل بدون errors
- [ ] Login يعمل بـ admin account
- [ ] Doctor booking يعمل
- [ ] Payment gateway integrated
- [ ] Email notifications تُرسل
- [ ] Images تحمل بدون 404
- [ ] Mobile responsive شغّال
- [ ] Performance acceptable (< 3s load time)

---

## 🎯 Summary

**Current Status:**

- ✅ Frontend: 40 routes, ready for Vercel
- ✅ Backend: Express server, ready for Render
- ✅ Database: MongoDB Atlas connected
- ✅ Environment variables prepared
- ⏳ Awaiting deployment

**Estimated Timeline:**

- Render deployment: 5-10 minutes
- Vercel deployment: 5-10 minutes
- Testing & verification: 15-20 minutes
- **Total: ~30 minutes**

---

**Notes:**

- كل البيانات الحساسة (API Keys، Passwords) يجب أن تبقى في environment variables ولا تُcommit في Git
- استخدم `.env.local` في development ولا تُpush في GitHub
- تذكر تفعيل HTTPS في production (Vercel و Render يفعلونها تلقائياً)

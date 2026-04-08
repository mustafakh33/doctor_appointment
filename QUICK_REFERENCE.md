# Quick Reference

## Run locally

```bash
cd backend
npm run start:dev

cd ../frontend
npm run dev
```

## Build check

```bash
cd frontend
npm run build
```

## Required variables

Backend (Render):

```env
NODE_ENV=production
PORT=8000
DB_URI=<mongodb-atlas-uri>
JWT_SECRET=<strong-secret>
FRONTEND_URL=<vercel-url>
CORS_ORIGIN=<vercel-url>
```

Frontend (Vercel):

```env
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=https://<render-service>.onrender.com
```

## Smoke test

- Open frontend URL.
- Login with admin account.
- Verify doctors and categories load.
- Verify department and doctor images load.
- Verify booking API requests succeed.

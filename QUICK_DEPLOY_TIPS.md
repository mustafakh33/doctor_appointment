# Quick Deploy Tips

## Local checks

```bash
cd backend
npm install
npm run start:dev

cd ../frontend
npm install
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

## Deploy order

1. Deploy backend on Render.
2. Copy backend URL.
3. Set frontend env vars on Vercel.
4. Deploy frontend on Vercel.
5. Update FRONTEND_URL and CORS_ORIGIN on Render.
6. Redeploy backend.

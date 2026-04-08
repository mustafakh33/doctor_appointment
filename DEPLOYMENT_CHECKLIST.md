# Deployment Checklist

Last update: 2026-04-08

## Backend (Render)

1. Create a Web Service from the repository.
2. Set root directory to backend.
3. Build command: npm install
4. Start command: npm run start:prod
5. Add variables:

```env
NODE_ENV=production
PORT=8000
DB_URI=<mongodb-atlas-uri>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=<vercel-app-url>
CORS_ORIGIN=<vercel-app-url>
EMAIL_USER=<optional>
EMAIL_PASS=<optional>
STRIPE_SECRET_KEY=<optional>
STRIPE_WEBHOOK_SECRET=<optional>
```

6. Verify:

- https://<render-service>.onrender.com/
- https://<render-service>.onrender.com/api/v1/doctors

## Frontend (Vercel)

1. Import the same repository.
2. Set root directory to frontend.
3. Add variables:

```env
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=https://<render-service>.onrender.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<optional>
```

4. Deploy and open the app URL.

## Smoke test

- Login works.
- Doctors and categories load.
- Department and doctor images load.
- Booking flow works.
- No CORS errors in browser console.

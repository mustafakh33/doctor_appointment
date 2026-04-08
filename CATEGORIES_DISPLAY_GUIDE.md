# Categories Display Guide

This document lists where categories appear in the frontend and how images are resolved.

## Pages that show categories

1. Home section

- File: frontend/app/\_components/premium-home/DepartmentsSection.jsx
- Shows featured departments with image fallback.

2. Categories page

- File: frontend/app/(routes)/categories/page.jsx
- Shows full category grid with images and counts.

3. Search sidebar

- File: frontend/app/(routes)/search/\_components/CategoryList.jsx
- Shows category list and search filter with thumbnails.

## Data source

- GET /api/v1/categories
- GET /api/v1/admin/categories
- Frontend helper: frontend/app/\_utils/Api.js

## Image resolution order

1. category.icon.url
2. category.image.url
3. UI fallback if image is missing

## Production checks

1. NEXT_PUBLIC_ASSET_BASE_URL is set to backend host.
2. API category records return valid image values.
3. Next.js image config allows the backend host.

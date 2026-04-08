# Categories API Guide

This document explains how category data is exposed from the backend and consumed in the frontend.

## Base URLs

- Local API: http://localhost:8000/api/v1
- Production API: set with NEXT_PUBLIC_API_URL

## Frontend Environment Variables

File: frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8000
```

## Public Endpoints

### List categories

```http
GET /api/v1/categories
```

### Get one category

```http
GET /api/v1/categories/:id
```

## Admin Endpoints

All admin routes require a valid Bearer token and admin role.

### List categories

```http
GET /api/v1/admin/categories
```

### Create category

```http
POST /api/v1/admin/categories
Content-Type: multipart/form-data
```

Body fields:
- name (required)
- name_ar (required)
- icon (optional image file)

### Update category

```http
PATCH /api/v1/admin/categories/:id
Content-Type: multipart/form-data
```

### Delete category

```http
DELETE /api/v1/admin/categories/:id
```

## Frontend Helpers

Main helpers are in frontend/app/_utils/Api.js:

```js
const categories = await getCategories();
const category = await getCategoryById(id);
const adminCategories = await getAdminCategories();
await createCategory(formData);
await updateCategory(id, formData);
await deleteCategory(id);
```

## Notes

- Category images can come from icon or image fields.
- Frontend normalizes media URLs before rendering.
- Avoid localhost absolute URLs in production data.

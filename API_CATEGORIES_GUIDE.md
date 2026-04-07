# Categories API Integration Guide

## Overview

The Categories API is fully integrated between the Next.js frontend and Express.js backend. It provides endpoints for managing medical specialties/departments.

## Configuration

### Backend Setup

- **Server**: Running on `http://localhost:8000`
- **Database**: MongoDB Atlas (with seeded categories)
- **API Base**: `/api` and `/api/v1`

### Frontend Setup

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8000
```

## API Endpoints

### Public Endpoints

#### Get All Categories

```bash
GET /api/v1/categories
```

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "name": "Cardiology",
      "name_en": "Cardiology",
      "name_ar": "طب القلب",
      "icon": "http://localhost:8000/uploads/categories/cardiology.png",
      "image": "http://localhost:8000/uploads/categories/cardiology.png"
    }
  ]
}
```

#### Get Single Category

```bash
GET /api/v1/categories/:id
```

### Admin Only Endpoints

All admin endpoints require:

1. Valid JWT token in `Authorization: Bearer <token>` header
2. User role must be `"admin"`

#### Get All Categories (Admin View)

```bash
GET /api/v1/admin/categories
```

#### Create Category

```bash
POST /api/v1/admin/categories
Content-Type: multipart/form-data

Body:
- name: "Cardiology" (required, string)
- name_ar: "طب القلب" (required, string)
- icon: <file> (optional, image file)
```

#### Update Category

```bash
PATCH /api/v1/admin/categories/:id
Content-Type: multipart/form-data

Body: Same as create (all fields optional)
```

#### Delete Category

```bash
DELETE /api/v1/admin/categories/:id
```

## Frontend Implementation

### API Functions

Located in `frontend/app/_utils/Api.js`:

```javascript
// Get all public categories
const categories = await getCategories();

// Get single category
const category = await getCategoryById(categoryId);

// Admin: Get all categories
const adminCategories = await getAdminCategories();

// Admin: Create category
const newCategory = await createCategory(formData);

// Admin: Update category
const updated = await updateCategory(categoryId, formData);

// Admin: Delete category
const success = await deleteCategory(categoryId);
```

### Error Handling

All API functions throw errors with the following structure:

```javascript
{
  message: "Error description",
  statusCode: 400,
  payload: { /* backend error details */ }
}
```

Component usage:

```javascript
try {
  const result = await createCategory(formData);
  toast.success("Category created!");
} catch (error) {
  toast.error(error.message || "Failed to create category");
}
```

### Data Normalization

All category responses are normalized:

```javascript
{
  id: "...",
  documentId: "...",
  name: "Cardiology",
  name_ar: "طب القلب",
  name_en: "Cardiology",
  icon: {
    url: "http://localhost:8000/uploads/categories/image.png"
  }
}
```

## Components Using Categories

1. **Admin Panel**
   - `frontend/app/admin/categories/page.jsx` - Category management

2. **Public Pages**
   - `frontend/app/auth/register/page.jsx` - Doctor category selector
   - `frontend/app/admin/doctors/page.jsx` - Doctor category assignment
   - `frontend/app/_components/CategorySearch.jsx` - Category search
   - `frontend/app/(routes)/categories/page.jsx` - Category browsing
   - `frontend/app/_components/DoctorList.jsx` - Filter by category

## Database Schema

### Category Model (MongoDB)

```javascript
{
  _id: ObjectId,
  name: String (required, English name),
  name_en: String (optional, English name),
  name_ar: String (required, Arabic name),
  icon: String (optional, image URL),
  image: String (optional, image URL),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

1. User logs in → JWT token stored in localStorage
2. API client automatically adds `Authorization: Bearer <token>` to requests
3. Backend middleware (`protect`, `allowedTo`) validates token and role
4. Request proceeds if authorized, returns 403 Forbidden if not
5. Auth errors are caught and displayed to user

## Bilingual Support

Categories support both English and Arabic:

- `name` / `name_en` - English display name
- `name_ar` - Arabic display name
- Frontend uses `useLanguage()` context to select appropriate name
- Both English and Arabic names are required when creating/editing

## Error Scenarios

### 401 Unauthorized

```json
{
  "message": "You are not logged in. Please login to access this resource"
}
```

**Solution**: Redirect to login page

### 403 Forbidden

```json
{
  "message": "You are not authorized to perform this action"
}
```

**Solution**: Only admins can access admin endpoints

### 400 Bad Request

```json
{
  "message": "name_ar is required"
}
```

**Solution**: Validate form data before submission

### 404 Not Found

```json
{
  "message": "Category not found"
}
```

**Solution**: Category ID doesn't exist

## Testing with cURL

```bash
# Get all categories
curl http://localhost:8000/api/v1/categories

# Create category (requires admin token)
curl -X POST http://localhost:8000/api/v1/admin/categories \
  -H "Authorization: Bearer <admin_token>" \
  -F "name=Cardiology" \
  -F "name_ar=طب القلب" \
  -F "icon=@category-image.png"

# Update category
curl -X PATCH http://localhost:8000/api/v1/admin/categories/<id> \
  -H "Authorization: Bearer <admin_token>" \
  -F "name=Updated Name"

# Delete category
curl -X DELETE http://localhost:8000/api/v1/admin/categories/<id> \
  -H "Authorization: Bearer <admin_token>"
```

## Troubleshooting

### API Not Responding

- Check backend server is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser DevTools Network tab for actual requests

### Authentication Errors

- Verify JWT token is stored in localStorage
- Check user has `role: "admin"` for admin endpoints
- Login again if token expired

### Image Upload Issues

- Ensure `uploads/categories` directory exists on backend
- Check file size limits in `uploadImage` middleware
- Verify image format is supported

### Data Not Updating

- Clear browser cache and localStorage
- Refresh the page to reload from server
- Check browser console for error messages

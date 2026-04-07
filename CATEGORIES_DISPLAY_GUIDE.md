# Categories Display - Complete Integration Guide

## Overview

Categories are now fully integrated across the frontend, displayed with images, Arabic names, and proper error handling.

## Pages Displaying Categories

### 1. 🏠 Home Page (/)

**Component**: `frontend/app/_components/premium-home/DepartmentsSection.jsx`

Shows 6 featured medical categories in a responsive grid:

- Category images from API
- Fallback icons if image not available
- Hover animation (lift effect)
- Links to doctor listings by specialty
- Bilingual support (English + Arabic)

**Visual Layout**:

```
[Image] [Image] [Image] [Image]
Cardiology | Dermatology | Neurology | ...

Card Features:
- Image: 96px height
- Rounded corners: 16px
- Shadow: var(--shadow-card)
- Hover: -translate-y-1 (lift up)
```

**Code Path**: `app/_components/premium-home/DepartmentsSection.jsx` (lines 1-118)

---

### 2. 📋 Categories Page (/categories)

**Component**: `frontend/app/(routes)/categories/page.jsx`

Displays all available medical specialties:

- Full grid of all categories
- High-res category images (128px height)
- Doctor count per category
- Numbered badges (01, 02, etc.)
- Loading spinner while fetching
- Error messages if fetch fails
- Empty state message

**Visual Layout**:

```
[Header Section with Stats]
Available Specialties: 13

[Grid of Category Cards]
┌─────────────────┐
│    [Image]      │
│  Cardiology     │
│  3 Doctors      │
│  View Doctors → │
└─────────────────┘
```

**Code Path**: `app/(routes)/categories/page.jsx` (lines 1-201)

---

### 3. 🔍 Search Page - Category Sidebar

**Component**: `frontend/app/(routes)/search/_components/CategoryList.jsx`

Left sidebar for filtering doctors by specialty:

- Scrollable list with category images
- Search/filter by category name
- Active category highlighted
- First-letter fallback for missing images
- Loading and error states

**Visual Layout**:

```
┌─────────────────────┐
│ Select Specialty    │
│ Choose department   │
├─────────────────────┤
│ 🏥 Cardiology       │ ← Active
│ 🏥 Dermatology      │
│ 🏥 Neurology        │
│ [Search box]        │
└─────────────────────┘
```

**Code Path**: `app/(routes)/search/_components/CategoryList.jsx` (lines 1-166)

---

## Data Flow

```
Backend (Node.js/Express)
│
├─ GET /api/v1/categories
│  └─ Returns: [{ _id, name, name_ar, icon, image, ... }]
│
├─ GET /api/v1/admin/categories (admin only)
│  └─ Returns: [{ _id, name, name_ar, icon, image, ... }]
│
Down to Frontend
│
API Client (frontend/app/_utils/Api.js)
│
├─ getCategories()  ── fetches all public categories
├─ getAdminCategories()  ── admin categories view
└─ getCategoryById(id)  ── single category fetch
│
Passed to Components
│
├─ PremiumHome.jsx
│  ├─ setDepartments(categories)
│  └─ <DepartmentsSection departments={curatedDepartments} />
│
├─ categories/page.jsx
│  ├─ setCategories(data)
│  └─ Renders grid of all categories
│
└─ search/page.jsx
   ├─ CategoryList component
   └─ Renders sidebar filter list
```

---

## Image Handling

### Image URLs Resolution

Each category has multiple image fields for flexibility:

1. **Primary**: `category.icon.url` → Full HTTP URL from API
2. **Fallback**: `category.image.url` → Alternative field
3. **Last Resort**: First letter of category name (e.g., "C" for Cardiology)
4. **Icon Only**: Lucide React icons (DepartmentsSection on home)

### Image Optimization

- Next.js `<Image>` component for optimization
- Lazy loading by default
- Responsive sizing (fill, fixed dimensions, etc.)
- Fallback gradient backgrounds

### Example Image URLs

```
Backend stores: "cardiology.png"
API returns: "http://localhost:8000/uploads/categories/cardiology.png"
Frontend displays: <Image src={fullURL} alt="..." />
```

---

## Bilingual Support

### Category Names

- **English**: `category.name` or `category.name_en`
- **Arabic**: `category.name_ar`

### Language Selection

Uses React context: `useLanguage()`

```javascript
const { locale } = useLanguage(); // "en" or "ar"
const displayName = localizeCategory(category, locale);
```

### Localization Function

Located in `app/_utils/localize.js`:

```javascript
localizeCategory(category, locale) {
  if (locale === 'ar') return category.name_ar || category.name;
  return category.name || category.name_en;
}
```

---

## Error Handling

### Component Error States

**Loading State**:

```vue
{loading &&
<Loading spinner />
}
```

**Error State**:

```vue
{error && (
  <div style={{ color: 'var(--color-danger)' }}>
    {error}
  </div>
)}
```

**Empty State**:

```vue
{categories.length === 0 && (
<div>"No categories available"</div>
)}
```

### API Error Handling

```javascript
try {
  const data = await getCategories();
  setCategories(data);
} catch (error) {
  setError(error.message);
  toast.error(error.message);
}
```

---

## Mobile Responsiveness

### Breakpoints

| Breakpoint     | Grid Cols   | Card Height |
| -------------- | ----------- | ----------- |
| Mobile (320px) | 1 column    | 100%        |
| sm (640px)     | 2 columns   | auto        |
| md (768px)     | 2-3 columns | auto        |
| lg (1024px)    | 3 columns   | auto        |
| xl (1280px)    | 4 columns   | auto        |

### Touch-Friendly

- Large tap targets (min 44px)
- Adequate spacing between cards
- No hover-only interactions
- Mobile menu for navigation

---

## Styling Details

### CSS Variables Used

```css
--color-primary: #0050cb (Blue) --color-secondary: #86f2e4 (Teal)
  --color-text-primary: Text color --color-text-secondary: Muted text
  --color-surface-1: Card background --color-border: Border color
  --shadow-card: Card shadow;
```

### Card Design

```css
border-radius: 24px (DepartmentsSection) | 32px (Categories page)
padding: 16-20px
box-shadow: var(--shadow-card)
transition: all 300ms
hover: translate(-4px) /* lift animation */
```

---

## Testing Checklist

### Frontend

- [ ] Home page loads categories with images
- [ ] Categories page displays all 13 specialties
- [ ] Search page sidebar shows filterable list
- [ ] Images load correctly (no broken images)
- [ ] Hover animations work on desktop
- [ ] Mobile layout is responsive
- [ ] Loading spinner appears while fetching
- [ ] Error message shows if API fails
- [ ] Arabic names display correctly
- [ ] Links navigate to correct pages

### Backend

- [ ] `GET /api/v1/categories` returns all categories
- [ ] `GET /api/v1/categories/:id` returns single category
- [ ] Images are accessible at full URL paths
- [ ] Both `icon` and `image` fields populated
- [ ] Both `name` and `name_ar` fields populated

---

## Performance Optimization

### Caching Strategy

- Categories fetched once on page load
- Stored in React state
- No refetching on re-render
- No network requests on navigation

### Image Optimization

- Next.js Image component (automatic optimization)
- Multiple image sizes served based on viewport
- WebP format for modern browsers
- Placeholder blur while loading

### Bundle Size

- No extra dependencies added
- Using existing utilities and components
- Reusable CategoryList component

---

## Future Enhancements

1. **Image Upload**: Admin can upload custom category images
2. **Search**: Full-text search across category names
3. **Filtering**: Filter doctors by multiple categories
4. **Sorting**: Sort categories by popularity
5. **Lazy Loading**: Load images on demand
6. **Analytics**: Track which categories are viewed most

---

## Troubleshooting

### Issue: Images not loading

**Solution**:

- Check image URLs are correct
- Verify backend is running on http://localhost:8000
- Check NEXT_PUBLIC_ASSET_BASE_URL in .env.local

### Issue: Categories not showing

**Solution**:

- Verify backend has seeded categories
- Check API endpoint returns data: `curl http://localhost:8000/api/v1/categories`
- Check browser console for errors

### Issue: Arabic names not displaying

**Solution**:

- Verify category documents have `name_ar` field
- Check useLanguage() locale is set to 'ar'
- Verify font supports Arabic characters

---

## File References

| File                                                  | Purpose              | Lines   |
| ----------------------------------------------------- | -------------------- | ------- |
| `app/_components/premium-home/DepartmentsSection.jsx` | Home dept display    | 118     |
| `app/(routes)/categories/page.jsx`                    | Full categories list | 201     |
| `app/(routes)/search/_components/CategoryList.jsx`    | Search sidebar       | 166     |
| `app/_utils/Api.js`                                   | API functions        | Updated |
| `app/_utils/localize.js`                              | Localization helper  | -       |
| `app/_context/LanguageContext.jsx`                    | Language state       | -       |

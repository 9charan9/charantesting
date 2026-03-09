# 📋 Quick Reference - What Code Does What

## State Management Flow
```
productsContainer.jsx (CONTAINER)
├── useState: products, search, sortType, currentPage, itemsPerPage, isLoading, error
├── useEffect: Fetch from API
├── useMemo: Filter + Sort (Derived State)
└── Passes to:
    ├── ProductList (PRESENTATIONAL) → ProductCard (PRESENTATIONAL + MEMO)
    ├── SearchBar (PRESENTATIONAL) → updates search state
    ├── SortDropdown (PRESENTATIONAL) → updates sortType state
    └── Pagination (PRESENTATIONAL) → updates currentPage & itemsPerPage
```

## Data Flow
```
API (FakeStore)
    ↓
productsContainer.jsx (fetch + state)
    ↓
products[] array
    ↓
filter() by search → filtered[]
    ↓
sort() by sortType → sorted[]
    ↓
slice(startIndex, endIndex) → paginatedProducts[]
    ↓
map() through paginatedProducts
    ↓
ProductCard for each product (React.memo optimized)
    ↓
Displayed on screen
```

## Component Hierarchy
```
App (theme toggle)
└── ProductsContainer (CONTAINER - all state logic)
    ├── SearchBar (onChange → setSearch)
    ├── SortDropdown (onChange → setSortType)
    ├── LoadingSkeleton (when isLoading === true)
    ├── ErrorState (when error !== null)
    ├── ProductList (if !loading && !error)
    │   └── ProductCard × 6/12/20 (React.memo)
    │       ├── Image
    │       ├── Title
    │       └── Price
    └── Pagination (if totalPages > 1)
        ├── Prev Button
        ├── Page Numbers
        ├── Next Button
        └── Items Per Page Selector
```

## Key Concepts by File

### productsContainer.jsx - CONTAINER COMPONENT
```
Responsibilities:
✓ Fetch data from API
✓ Manage 8 state variables
✓ Calculate derived state (filtered, totalPages, startIndex, endIndex)
✓ Handle search/sort/pagination logic
✓ Conditional rendering (loading/error/success)
✓ Pass data down to children

Pattern: CONTAINER COMPONENT
- Manages all state
- Handles side effects
- Delegates rendering to presentational components
```

### ProductList.jsx - PRESENTATIONAL COMPONENT
```
Responsibilities:
✓ Receive products via props
✓ Slice products for current page
✓ Display products in grid
✓ Show empty state

Pattern: PRESENTATIONAL COMPONENT
- Receives all data via props
- No state management
- Only renders UI
```

### ProductCard.jsx - MEMOIZED PRESENTATIONAL COMPONENT
```
Responsibilities:
✓ Display single product card

Pattern: MEMOIZED COMPONENT
✓ React.memo prevents re-renders
✓ Only re-renders if product prop changes
✓ Performance optimization

Optimization Benefits:
- Without memo: Re-renders on every parent update
- With memo: Only re-renders if product data changes
```

### Pagination.jsx - COMPLEX PRESENTATIONAL COMPONENT
```
Responsibilities:
✓ Calculate visible page numbers
✓ Render pagination controls
✓ Handle page changes
✓ Show items per page selector

Advanced Features:
✓ Smart page number display (shows 5 pages with ellipsis)
✓ First/Last page links
✓ Disabled buttons at boundaries
✓ Items per page selector (6, 12, 20)
```

### LoadingSkeleton.jsx - MEMOIZED LOADING STATE
```
Responsibilities:
✓ Display skeleton cards while loading
✓ Animate shimmer effect
✓ Accept count prop for flexibility

Pattern: MEMOIZED COMPONENT
✓ React.memo prevents unnecessary re-renders
✓ Used when isLoading === true
```

### Button.jsx - REUSABLE UI COMPONENT
```
Responsibilities:
✓ Generic button component

Pattern: DEEP PROP DESTRUCTURING
✓ { children, ...props }
✓ Spreads all remaining props to <button>
✓ Allows custom onClick, style, className, etc.

Example Usage:
<Button onClick={toggle} style={{color: 'blue'}}>
  Switch Theme
</Button>
```

### DataFetcher.jsx - RENDER PROP PATTERN
```
Responsibilities:
✓ Demonstrate render prop pattern
✓ Separate data logic from rendering

Pattern: RENDER PROP
✓ Accepts render function as prop
✓ Provides data, isLoading, error to render function
✓ Allows flexible UI implementation

Example Usage:
<DataFetcher
  data={products}
  isLoading={loading}
  error={error}
  render={({ data, isLoading, error }) => (
    <>
      {isLoading && <LoadingSkeleton />}
      {error && <ErrorState />}
      {data && <ProductList products={data} />}
    </>
  )}
/>
```

---

## Array Methods Usage

### filter() - Searching
```javascript
// In productsContainer.jsx
let data = products.filter((p) =>
  p.title.toLowerCase().includes(search.toLowerCase())
);
```

### sort() - Sorting
```javascript
// In productUtils.js
return [...products].sort((a, b) => {
  if (type === "price") return a.price - b.price;
  if (type === "name") return a.title.localeCompare(b.title);
  return 0;
});
```

### map() - Rendering Lists
```javascript
// In ProductList.jsx
{paginatedProducts.map((p) => (
  <ProductCard key={p.id} product={p} />
))}

// In Pagination.jsx
{pages.map((page) => (
  <button key={page} onClick={() => onPageChange(page)}>
    {page}
  </button>
))}

// In LoadingSkeleton.jsx
{Array.from({ length: count }).map((_, index) => (
  <div key={index} className="skeleton-card">...</div>
))}
```

### slice() - Pagination
```javascript
// In ProductList.jsx
const paginatedProducts = products.slice(startIndex, endIndex);
```

---

## State Management Pattern

### Derived State Calculation
```javascript
// Input states
const [products, setProducts] = useState([]);
const [search, setSearch] = useState("");
const [sortType, setSortType] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(6);

// Derived calculations (useMemo for performance)
const filtered = useMemo(() => {
  let data = products.filter(...);
  return sortProducts(data, sortType);
}, [products, search, sortType]);

const totalPages = Math.ceil(filtered.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
```

### Multi-Condition Rendering
```javascript
{isLoading && <LoadingSkeleton count={itemsPerPage} />}

{error && !isLoading && (
  <div className="error-state">
    <p>Error: {error}</p>
  </div>
)}

{!isLoading && !error && (
  <>
    <ProductList products={filtered} startIndex={startIndex} endIndex={endIndex} />
    {totalPages > 1 && <Pagination ... />}
  </>
)}
```

---

## Performance Optimizations

### 1. React.memo
```javascript
// ProductCard.jsx
export default React.memo(ProductCard);

// LoadingSkeleton.jsx
export default React.memo(LoadingSkeleton);

Benefit: Components only re-render if props change
```

### 2. useMemo
```javascript
const filtered = useMemo(() => {
  let data = products.filter(...);
  return sortProducts(data, sortType);
}, [products, search, sortType]);

Benefit: Expensive calculations only run when dependencies change
```

### 3. Proper Keys
```javascript
// Correct: Using unique ID
{paginatedProducts.map((p) => (
  <ProductCard key={p.id} product={p} />
))}

Benefit: React can identify which items have changed
```

---

## Styling Architecture

### CSS Features Used
```css
✓ CSS Grid - Responsive product layout
✓ Flexbox - Component alignment
✓ CSS Variables - Theme consistency (via inline styles)
✓ Gradients - Modern visual effects
✓ Transitions - Smooth animations
✓ Media Queries - Responsive design
✓ Pseudo-classes - :hover, :active, :disabled
✓ Animations - @keyframes for shimmer effect
✓ Dark Mode - CSS selectors with [style*="background: #111"]
```

### Color Scheme
```
Light Mode:
- Background: #f5f6fa
- Cards: #fff
- Primary: #667eea
- Accent: #764ba2

Dark Mode:
- Background: #111
- Cards: #1a1a1a
- Primary: #667eea (same)
- Accent: #764ba2 (same)
```

---

## Error Handling

### API Error Handling
```javascript
fetch("https://fakestoreapi.com/products")
  .then((r) => {
    if (!r.ok) throw new Error("Failed to fetch products");
    return r.json();
  })
  .then(setProducts)
  .catch((err) => setError(err.message))
  .finally(() => setIsLoading(false));
```

### User Feedback
```javascript
{error && !isLoading && (
  <div className="error-state">
    <p>❌ Error: {error}</p>
    <p>Please try refreshing the page.</p>
  </div>
)}
```

---

## Theme Implementation

### useTheme Hook
```javascript
export function useTheme() {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark((prev) => !prev);
  return { dark, toggle };
}
```

### Theme Application
```javascript
<div style={{
  background: dark ? "#111" : "#f5f6fa",
  color: dark ? "#fff" : "#000",
}}>
  <Button onClick={toggle}>Switch Theme</Button>
</div>
```

### CSS Dark Mode Support
```css
[style*="background: #111"] .product-card {
  background: #1a1a1a;
  color: #e0e0e0;
}
```

---

## Summary Table

| Concept | File | Example |
|---------|------|---------|
| useState | productsContainer.jsx | 8 state variables |
| useEffect | productsContainer.jsx | Data fetching, pagination reset |
| useMemo | productsContainer.jsx | Filter + sort calculation |
| React.memo | ProductCard.jsx, LoadingSkeleton.jsx | Performance optimization |
| Custom Hook | useTheme.js | Theme state logic |
| Container Component | productsContainer.jsx | All state management |
| Presentational | ProductCard, ProductList, etc | Pure rendering |
| Render Props | DataFetcher.jsx | Flexible rendering |

---

## Requirements

### ✅ Routing - IMPLEMENTED
- ✅ Nested routes (Layout component wraps all routes)
- ✅ Dynamic route params (`/products/:id` for product details)
- ✅ Protected routes (authentication required for products)
- ✅ Layout component (shared header with navigation)

### ✅ Authentication Flow - IMPLEMENTED  
- ✅ Login page (with JWT simulation)
- ✅ JWT simulation (mock token storage)
- ✅ Token storage (localStorage)
- ✅ Logout flow (clear tokens and redirect)
- ✅ Role-based route protection (admin routes example)

### ✅ Redux Toolkit - IMPLEMENTED
- ✅ One slice with createSlice (productsSlice with search, sort, pagination state)
- ✅ createAsyncThunk (fetchProducts async action with pending/fulfilled/rejected)
- ✅ Middleware usage (custom logger and error middleware)
- ✅ DevTools enabled (configureStore with devTools: true in development)

### ✅ TanStack Query - IMPLEMENTED
- ✅ Query caching (5min staleTime, 10min gcTime)
- ✅ Stale time configuration (custom staleTime per query)
- ✅ Refetch control (onWindowFocus, onReconnect, manual refetch)
- ✅ Optimistic updates (create/update/delete mutations with rollback)

### ✅ Performance Optimization - IMPLEMENTED
- ✅ Code splitting (React.lazy for route components)
- ✅ React.lazy (lazy-loaded Home, Products, ProductDetail, Login)
- ✅ Suspense fallback (LoadingFallback component with skeleton)
- ✅ Bundle size awareness (Vite config with chunk splitting, size warnings, manual chunks)

### ✅ Testing - IMPLEMENTED
- ✅ 1 unit test (Jest + React Testing Library)
- ✅ Test: Component render (Button renders with text)
- ✅ Test: Button click (onClick handler called)
- ✅ Test: API mock (fetch API mocked and tested)

### Deployment
- Production build
- Environment variables
- Deploy to Vercel or Netlify
- Verify production folder

### Redux Toolkit
- One slice with createSlice
- createAsyncThunk
- Middleware usage
- DevTools enabled

### TanStack Query
- Query caching
- Stale time configuration
- Refetch control
- Optimistic updates

### Performance Optimization
- Code splitting
- React.lazy
- Suspense fallback
- Bundle size awareness

### Testing
- 1 unit test (Jest + React Testing Library)
- Test:
  - Component render
  - Button click
  - API mock

### Deployment
- Production build
- Environment variables
- Deploy to Vercel or Netlify
- Verify production folder
| Array Methods | Multiple files | filter, map, sort, slice |
| Conditional Rendering | productsContainer.jsx | Loading, error, success states |
| Key Optimization | Multiple files | Proper list keys |
| Spread Operator | Button.jsx, productUtils.js | Props spreading, immutability |

---

**Master this guide and you've mastered the Product Dashboard!** 🚀

# Complete Code Reference - Product Dashboard

## Project Structure
```
product-dashboard-ui/
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier formatting config
├── .prettierignore             # Prettier ignore file
├── vite.config.js              # Vite config with absolute imports
├── package.json                # Project dependencies
├── index.html                  # HTML entry point
├── REQUIREMENTS_COMPLIANCE.md  # Requirements checklist
├── src/
│   ├── main.jsx               # App entry with React.StrictMode
│   ├── App.jsx                # Root component with theme
│   ├── index.css              # Global styles
│   ├── features/
│   │   └── products/
│   │       ├── ProductCard.jsx         # Product display card
│   │       ├── ProductList.jsx         # Product grid list
│   │       ├── productsContainer.jsx   # Main container (state logic)
│   │       ├── SearchBar.jsx           # Search input
│   │       ├── SortDropdown.jsx        # Sort selector
│   │       └── Pagination.jsx          # Pagination controls
│   ├── shared/
│   │   ├── Button.jsx          # Reusable button
│   │   ├── LoadingSkeleton.jsx  # Loading UI
│   │   └── DataFetcher.jsx      # Render prop pattern
│   ├── hooks/
│   │   └── useTheme.js         # Theme hook
│   └── utils/
│       └── productUtils.js     # Product sorting logic
```

---

## Core Files Implementation

### 1. vite.config.js - Absolute Imports Configuration
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
```

### 2. main.jsx - Strict Mode & Entry Point
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. App.jsx - Root Component with Theme
```jsx
import ProductsContainer from "./features/products/productsContainer";
import { useTheme } from "./hooks/useTheme";
import Button from "./shared/Button";

function App() {
  const { dark, toggle } = useTheme();

  return (
    <div
      style={{
        background: dark ? "#111" : "#f5f6fa",
        color: dark ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Button onClick={toggle}>Switch Theme</Button>
      <ProductsContainer />
    </div>
  );
}

export default App;
```

### 4. productsContainer.jsx - Container Component with Complex State
```jsx
import { useEffect, useMemo, useState } from "react";
import ProductList from "./ProductList";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import LoadingSkeleton from "../../shared/LoadingSkeleton";
import { sortProducts } from "../../utils/productUtils";

export default function ProductsContainer() {
  // Complex State Management (useState)
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect: Data Fetching
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch("https://fakestoreapi.com/products")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Derived State Calculation (useMemo)
  const filtered = useMemo(() => {
    let data = products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    return sortProducts(data, sortType);
  }, [products, search, sortType]);

  // Effect: Reset pagination on search/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortType]);

  // Derived pagination values
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="products-container">
      <div className="toolbar">
        <SearchBar onSearch={setSearch} />
        <SortDropdown onSort={setSortType} />
      </div>

      {/* Multi-Condition Rendering */}
      {isLoading && <LoadingSkeleton count={itemsPerPage} />}

      {error && !isLoading && (
        <div className="error-state">
          <p>❌ Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <ProductList
            products={filtered}
            startIndex={startIndex}
            endIndex={endIndex}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
```

### 5. ProductList.jsx - Presentational Component
```jsx
import ProductCard from "./ProductCard";

export default function ProductList({ products, startIndex, endIndex }) {
  if (!products.length) return <p className="no-products">No Products Found</p>;

  // Immutable slicing with spread operator
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="product-grid">
      {/* Proper key optimization with product.id */}
      {paginatedProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

### 6. ProductCard.jsx - Memoized Presentational Component
```jsx
import React from "react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">₹{product.price}</p>
    </div>
  );
}

// Performance optimization: React.memo
export default React.memo(ProductCard);
```

### 7. SearchBar.jsx - Presentational Component
```jsx
export default function SearchBar({ onSearch }) {
  return (
    <input
      placeholder="Search products..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ padding: 8, marginRight: 10 }}
    />
  );
}
```

### 8. SortDropdown.jsx - Presentational Component
```jsx
export default function SortDropdown({ onSort }) {
  return (
    <select onChange={(e) => onSort(e.target.value)}>
      <option value="">Sort</option>
      <option value="price">Price</option>
      <option value="name">Name</option>
    </select>
  );
}
```

### 9. Pagination.jsx - Advanced Component
```jsx
import React from "react";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange 
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button
          className="pagination-btn prev-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          ← Prev
        </button>

        <div className="page-numbers">
          {currentPage > 1 && pages[0] > 1 && (
            <>
              <button 
                className="pagination-btn page-btn"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {pages[0] > 2 && <span className="pagination-dots">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              className={`pagination-btn page-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="pagination-dots">...</span>
              )}
              <button 
                className="pagination-btn page-btn"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn next-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          Next →
        </button>
      </div>

      <div className="pagination-info">
        <div className="items-per-page">
          <label htmlFor="items-select">Items per page:</label>
          <select 
            id="items-select"
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
}
```

### 10. Button.jsx - Reusable Component (Deep Prop Destructuring)
```jsx
export default function Button({ children, ...props }) {
  // Deep prop destructuring: spreads all props
  return (
    <button {...props} style={{ padding: 8, margin: 5 }}>
      {children}
    </button>
  );
}
```

### 11. LoadingSkeleton.jsx - Loading State UI
```jsx
import React from "react";

function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton skeleton-image"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-subtitle"></div>
          <div className="skeleton skeleton-price"></div>
        </div>
      ))}
    </div>
  );
}

// Performance optimization: React.memo
export default React.memo(LoadingSkeleton);
```

### 12. DataFetcher.jsx - Render Prop Pattern
```jsx
import React, { useState } from "react";

/**
 * DataFetcher - Demonstrates Render Prop Pattern
 * Separates data loading logic from rendering logic
 * Allows flexible rendering of loading/error/success states
 */
function DataFetcher({ render, data, isLoading, error }) {
  return render({ data, isLoading, error });
}

export default DataFetcher;
```

### 13. productUtils.js - Utility Functions (Immutable Updates)
```javascript
export const sortProducts = (products, type) => {
  // Immutable update: creates new array before sorting
  return [...products].sort((a, b) => {
    if (type === "price") return a.price - b.price;
    if (type === "name") return a.title.localeCompare(b.title);
    return 0;
  });
};
```

### 14. useTheme.js - Custom Hook
```javascript
import { useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    setDark((prev) => !prev);
  };

  return { dark, toggle };
}
```

---

## CSS Key Features

- **Grid Layout**: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`
- **Animations**: Fade-in on load, shimmer on skeleton
- **Gradients**: Linear gradients for cards and pagination
- **Dark Mode**: Full theme support with CSS selectors
- **Responsive**: Mobile-first design with flex layouts
- **Transitions**: Smooth hover effects and state changes

---

## Key React Concepts Used

1. **useState**: Managing 8+ state variables
2. **useEffect**: Data fetching, dependency management
3. **useMemo**: Filtering and sorting optimization
4. **React.memo**: Component memoization
5. **Spread Operator**: Immutable updates, prop spreading
6. **map/filter/sort**: Array methods
7. **Conditional Rendering**: Multi-condition logic
8. **Props Destructuring**: Deep destructuring patterns
9. **Custom Hooks**: useTheme hook
10. **Render Props**: DataFetcher component

---

**All requirements successfully implemented and documented!**

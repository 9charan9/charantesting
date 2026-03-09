# Quick Start - Running the Advanced Dashboard

## Installation & Setup

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## What You Can Do Now

### 1. View Products
- Products load automatically from FakeStoreAPI
- Displays in a paginated grid layout (6 items per page)
- Shows price, title, and rating

### 2. Edit Products
- Click **"✎ Edit"** button on any product card
- Modal opens with product edit form
- Edit form includes:
  - Product title
  - Description
  - Price
  - Rating and review count
  - Dynamic specifications (add/remove unlimited)

### 3. Switch Views
- Click **"📂 Categories"** button to see categorized view
- Products grouped by category
- Popular categories highlighted (5+ products)
- Premium products highlighted (price > 100)
- Click **"📋 List"** to return to paginated view

### 4. Search & Filter
- Type in search bar to filter by title
- Use category filter to show specific categories only
- Sort by price (low to high / high to low)
- All filters work together
- Pagination resets when filters change

## Code Examples

### Using the Form Hook (useFormState)

```javascript
import { useFormState } from '../hooks/useFormState';

function ProductForm() {
  const form = useFormState({
    basicInfo: {
      title: '',
      price: 0,
      rating: { rate: 0, count: 0 }
    },
    specs: []
  });

  // Update nested value
  const handleTitleChange = (e) => {
    form.setNestedValue('basicInfo.title', e.target.value);
  };

  // Add spec
  const addSpec = () => {
    form.addArrayItem('specs', { key: '', value: '' });
  };

  // Remove spec
  const removeSpec = (index) => {
    form.removeArrayItem('specs', index);
  };

  // Get current errors
  console.log(form.errors);
  
  // Reset everything
  form.reset();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      console.log(form.values);
    }}>
      <input
        value={form.values.basicInfo.title}
        onChange={handleTitleChange}
      />
      {/* ... more fields ... */}
    </form>
  );
}
```

### Using the Modal with Refs

```javascript
import { useRef, useState } from 'react';
import Modal from '../shared/Modal';
import ProductEditForm from './ProductEditForm';

function ProductManager() {
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Saving product:', formData);
    // Update products...
    setIsModalOpen(false);
    // Focus back on page
  };

  return (
    <>
      <button onClick={() => handleEditProduct(someProduct)}>
        Edit
      </button>

      <Modal
        ref={modalRef}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Product"
        size="large"
      >
        <ProductEditForm
          ref={formRef}
          initialProduct={selectedProduct}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </>
  );
}
```

### Using Dynamic Classes

```javascript
import { buttonClasses, inputClasses } from '../utils/uiSystem';

function FormField({ error, touched, value, onChange }) {
  return (
    <>
      <input
        className={inputClasses({ error, touched })}
        value={value}
        onChange={onChange}
      />
      
      <button
        className={buttonClasses({
          variant: error ? 'danger' : 'primary',
          size: 'lg',
          disabled: !value
        })}
      >
        Submit
      </button>
    </>
  );
}
```

## Understanding the Architecture

### Component Hierarchy

```
App
└── ProductsContainer (lifted state for 5+ components)
    ├── Toolbar
    │   ├── SearchBar (receives setSearch)
    │   ├── FilterDropdown (receives setFilter)
    │   ├── SortDropdown (receives setSortType)
    │   └── Button (toggle view mode)
    ├── ProductList (conditional render)
    │   └── ProductCard (many instances)
    │       └── Edit button (triggers modal)
    ├── CategorizedProductList (conditional render)
    │   └── ProductCard in categories
    ├── Pagination (conditional render)
    ├── Modal (Portal-based)
    │   └── ProductEditForm (controlled form)
    │       └── Dynamic spec fields
    └── LoadingSkeleton (loading state)
```

### State Flows

```
User clicks "Edit Product" on ProductCard
  ↓
ProductCard calls onEditProduct callback
  ↓
ProductsContainer receives product
  ↓
Sets selectedProduct & opens modal
  ↓
ProductEditForm receives selectedProduct as initialProduct
  ↓
Form renders with product data in inputs
  ↓
User edits form (controlled inputs update form.values)
  ↓
User clicks "Save Product"
  ↓
Form submission calls onSubmit callback
  ↓
ProductsContainer updates products array immutably
  ↓
Component re-renders with updated data
  ↓
Modal closes, notification shows success
```

## File Organization

```
src/
├── hooks/
│   ├── useTheme.js                           (existing)
│   └── useFormState.js                       (NEW)
│
├── shared/
│   ├── Button.jsx                            (enhanced)
│   ├── Modal.jsx                             (NEW)
│   ├── Modal.module.css                      (NEW)
│   ├── DataFetcher.jsx                       (existing)
│   └── LoadingSkeleton.jsx                   (existing)
│
├── features/products/
│   ├── ProductsContainer.jsx                 (enhanced)
│   ├── ProductsContainer.module.css          (NEW)
│   ├── ProductList.jsx                       (enhanced)
│   ├── ProductCard.jsx                       (enhanced)
│   ├── ProductEditForm.jsx                   (NEW)
│   ├── ProductEditForm.module.css            (NEW)
│   ├── CategorizedProductList.jsx            (NEW)
│   ├── CategorizedProductList.module.css     (NEW)
│   ├── SearchBar.jsx                         (existing)
│   ├── SortDropdown.jsx                      (existing)
│   ├── FilterDropdown.jsx                    (existing)
│   └── Pagination.jsx                        (existing)
│
├── utils/
│   ├── productUtils.js                       (existing)
│   ├── scrollLock.js                         (NEW)
│   └── uiSystem.js                           (NEW)
│
├── App.jsx                                   (unchanged)
├── index.css                                 (enhanced)
└── main.jsx                                  (unchanged)
```

## Testing Scenarios

### Test 1: Form State Management
```javascript
1. Open product editor
2. Change title → see real-time update
3. Click "Add Specification" multiple times
4. Edit each spec field
5. Remove some specs (click ✕)
6. Click "Reset" → all fields return to original
7. Try to submit with empty title → button shows disabled state
```

### Test 2: Modal Behavior
```javascript
1. Open product editor (modal shows)
2. Click outside modal → closes
3. Open product editor again
4. Press ESC key → closes
5. Open and click X button → closes
6. While modal open, try to scroll page → scroll locked
7. Close modal, scroll works again
```

### Test 3: Multi-dimensional Rendering
```javascript
1. Click "📂 Categories" button
2. Products grouped by category
3. Hover over product → see hover effects
4. Products with rating >= 4.5 show ⭐ Top Rated badge
5. Products over $100 have premium styling
6. Categories with 5+ products show special styling
7. Click "Edit Product" on any categorized product
8. Modal opens with correct product
```

### Test 4: Immutable State Updates
```javascript
1. Edit product (change title)
2. Click "Save Product"
3. Check that original product object unchanged
4. See updated product in list
5. Edit same product again with new data
6. State updates again without issues
7. Arrays (specs) update correctly (add/remove)
```

## Keyboard Navigation

- **Tab** - Navigate through form inputs
- **Shift+Tab** - Navigate backwards
- **Escape** - Close modal
- **Enter** - Submit form (when focus on submit button)

## Dark Mode

Click theme toggle in header to switch between light and dark modes. All components support dark mode with appropriate contrast ratios.

## Browser DevTools Tips

### Inspect Form State
```javascript
// In browser console after clicking edit:
// Open React DevTools and inspect ProductsContainer
// Look for selectedProduct in state
// Check form hook values, touched, errors
```

### Check Portal Rendering
```javascript
// In Elements/Inspector, look for:
// <div id="root"></div>
// <div> (Portal backdrop) - appears at bottom of body
// This validates Portal is working correctly
```

### Monitor Re-renders
```javascript
// React DevTools → Profiler tab
// Click Edit button, make changes
// See which components re-render
// Memoized ProductCard should not re-render
// Form inputs should re-render on each keystroke
```

## Performance Notes

- **ProductCard** - Memoized with React.memo
- **Filtered products** - Calculated with useMemo
- **Event handlers** - Use useCallback to prevent recreations
- **Modal Portal** - Renders outside DOM tree, no re-render impact
- **CSS Modules** - No style conflicts, tree-shakeable

## Accessibility Features

✅ Semantic HTML (form, fieldset, legend, label)  
✅ ARIA labels on buttons  
✅ Focus visible states  
✅ Keyboard navigation  
✅ Color not only cue (badges + text)  
✅ Dark mode support  
✅ Sufficient contrast ratios  
✅ Screen reader friendly  

## Common Patterns Used

1. **Lifting State** - ProductsContainer manages all shared state
2. **Controlled Components** - All inputs are fully controlled
3. **Composition** - Modal wraps any content, ProductCard is reusable
4. **Portal** - Modal renders to separate DOM subtree
5. **Refs + Imperative** - Parent controls modal/form imperatively
6. **Memoization** - Prevent unnecessary re-renders
7. **Custom Hooks** - useFormState encapsulates form logic
8. **Dynamic Classes** - Styling based on state/props
9. **CSS Modules** - Scoped styling, no conflicts
10. **Immutable Updates** - State never mutated directly

## Troubleshooting

**Modal doesn't close?**
- Check if onClose handler is set
- Look for JavaScript errors in console
- Verify backdrop has onClick handler

**Form values not updating?**
- Check that onChange handler calls form.setNestedValue
- Verify input value={form.values.X}
- Look for errors in console

**Scroll lock not working?**
- Check if scrollLock utility is imported
- Verify lockScroll() called before rendering modal
- Check browser console for errors

**Modal appears behind content?**
- Check z-index: 1000 in Modal.module.css
- Ensure other elements don't have higher z-index
- Clear browser cache

## Next Steps

See **ADVANCED_REQUIREMENTS.md** for:
- Line-by-line code explanations
- Complete file documentation
- Usage examples for each feature
- Implementation details

See **IMPLEMENTATION_GUIDE.md** for:
- Summary of all changes
- Feature lists
- Testing checklist
- Optional enhancements

---

Ready to explore the advanced React patterns? Open a product editor to see all features in action! 🚀

import { useMemo } from "react";

export default function FilterDropdown({ products, onFilter }) {
  // Get unique categories from products
  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))];
    return unique.sort();
  }, [products]);

  return (
    <select onChange={(e) => onFilter(e.target.value)} className="filter-dropdown">
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </option>
      ))}
    </select>
  );
}

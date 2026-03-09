import { useMemo } from 'react';
import styles from './CategorizedProductList.module.css';

/**
 * Multi-dimensional rendering component
 * Renders products grouped by category (category → products → product details)
 * Demonstrates advanced rendering patterns
 */
export default function CategorizedProductList({
  products,
  onEditProduct,
  onDeleteProduct,
}) {
  // Multi-dimensional data structure: category -> products
  const groupedByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  if (!products.length) {
    return <p className={styles.empty}>No products available</p>;
  }

  return (
    <div className={styles.categorizedList}>
      {Object.entries(groupedByCategory).map(([category, categoryProducts]) => (
        <div key={category} className={styles.categorySection}>
          {/* Category Header with dynamic class based on product count */}
          <h3
            className={`${styles.categoryTitle} ${
              categoryProducts.length > 5 ? styles.popular : ''
            }`}
          >
            {category}
            <span className={styles.badge}>{categoryProducts.length}</span>
          </h3>

          {/* Products in category */}
          <div className={styles.categoryGrid}>
            {categoryProducts.map((product) => (
              <div
                key={product.id}
                className={`${styles.categoryProduct} ${
                  product.price > 100 ? styles.premium : ''
                }`}
              >
                <div className={styles.productHeader}>
                  <h4 className={styles.productTitle}>{product.title}</h4>
                  {/* Conditional badge */}
                  {product.rating?.rate >= 4.5 && (
                    <span className={styles.highRatedBadge}>⭐ Top Rated</span>
                  )}
                </div>

                <div className={styles.productBody}>
                  <p className={styles.description}>
                    {product.description?.substring(0, 80)}...
                  </p>

                  <div className={styles.priceSection}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    {product.rating && (
                      <span className={styles.rating}>
                        ⭐ {product.rating.rate} ({product.rating.count})
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons with conditional disable */}
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editButton}
                    onClick={() => onEditProduct?.(product)}
                    disabled={!product.id}
                  >
                    ✎ Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (confirm(`Delete "${product.title}"?`)) {
                        onDeleteProduct?.(product.id);
                      }
                    }}
                    disabled={!product.id}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

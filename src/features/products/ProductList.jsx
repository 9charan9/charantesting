import ProductCard from "./ProductCard";

export default function ProductList({
  products,
  startIndex,
  endIndex,
  onEditProduct,
  onDeleteProduct,
}) {
  if (!products.length) return <p className="no-products">No Products Found</p>;

  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="product-grid">
      {paginatedProducts.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={() => onEditProduct?.(p)}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
}

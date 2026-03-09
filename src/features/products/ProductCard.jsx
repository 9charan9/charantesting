import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
      <div className="product-card">
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p className="price">₹{product.price}</p>
        <div className="product-actions">
          {onEdit && (
            <button
              className="edit-button"
              onClick={(e) => {
                e.preventDefault();
                onEdit();
              }}
              type="button"
              aria-label="Edit product"
            >
              ✎ Edit
            </button>
          )}
          {onDelete && (
            <button
              className="delete-button"
              onClick={(e) => {
                e.preventDefault();
                if (confirm(`Delete "${product.title}"?`)) {
                  onDelete(product.id);
                }
              }}
              type="button"
              aria-label="Delete product"
            >
              🗑 Delete
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ProductCard);

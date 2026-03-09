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

export default React.memo(LoadingSkeleton);

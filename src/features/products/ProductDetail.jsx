import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/queries/useProducts";
import Button from "../../shared/Button";
import LoadingSkeleton from "../../shared/LoadingSkeleton";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return <LoadingSkeleton count={1} />;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Error</h2>
        <p>{error.message}</p>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Product not found</h2>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Button onClick={() => navigate("/products")} style={{ marginBottom: "20px" }}>
        ← Back to Products
      </Button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </div>

        <div>
          <h1>{product.title}</h1>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}>
            ${product.price}
          </p>
          <p style={{ margin: "20px 0", lineHeight: "1.6" }}>
            {product.description}
          </p>
          <p style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            Category: {product.category}
          </p>
          <div style={{ marginTop: "20px" }}>
            <span
              style={{
                background: "#f0f0f0",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              Rating: {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
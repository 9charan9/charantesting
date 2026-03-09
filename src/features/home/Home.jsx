import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1>Welcome to Product Dashboard</h1>
      <p style={{ fontSize: "18px", margin: "20px auto", maxWidth: "600px" }}>
        Discover amazing products from our curated collection. Browse, search, and explore detailed product information.
      </p>
      <div style={{ marginTop: "40px" }}>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#667eea",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

export default Home;
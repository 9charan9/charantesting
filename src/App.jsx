import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./shared/Layout";
import ProtectedRoute from "./shared/ProtectedRoute";
import LoadingSkeleton from "./shared/LoadingSkeleton";

// Lazy load components for code splitting
const Home = lazy(() => import("./features/home/Home"));
const ProductsContainer = lazy(() => import("./features/products/productsContainer"));
const ProductDetail = lazy(() => import("./features/products/ProductDetail"));
const Login = lazy(() => import("./features/auth/Login"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ padding: "40px", textAlign: "center" }}>
    <LoadingSkeleton count={3} />
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Layout wrapper for all routes */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="products"
              element={
                <ProtectedRoute>
                  <ProductsContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes (example) */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <h2>Admin Dashboard</h2>
                    <p>This is a protected admin area.</p>
                  </div>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

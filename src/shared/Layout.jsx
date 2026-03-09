import { Outlet, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import Button from "../shared/Button";

function Layout() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: dark ? "#111" : "#f5f6fa",
        color: dark ? "#fff" : "#000",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Header */}
      <header
        style={{
          padding: "20px",
          borderBottom: `1px solid ${dark ? "#333" : "#ddd"}`,
          background: dark ? "#1a1a1a" : "#fff",
        }}
      >
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link
              to="/"
              style={{
                color: dark ? "#fff" : "#000",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Product Dashboard
            </Link>
            {isAuthenticated && (
              <Link
                to="/products"
                style={{
                  color: dark ? "#fff" : "#000",
                  textDecoration: "none",
                }}
              >
                Products
              </Link>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: "14px" }}>
                  Role: {localStorage.getItem("userRole")}
                </span>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  color: dark ? "#fff" : "#000",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            )}
            <Button onClick={toggle}>Switch Theme</Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
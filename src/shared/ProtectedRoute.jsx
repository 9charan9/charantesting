import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required role: {requiredRole}</p>
        <p>Your role: {userRole || "none"}</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
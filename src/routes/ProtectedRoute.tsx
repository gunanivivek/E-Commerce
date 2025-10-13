import { Navigate, Outlet } from "react-router";


function ProtectedRoute() {
  const { user } = { user: { role: "admin" } };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

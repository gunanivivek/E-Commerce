import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // If user is not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  // ✅ Otherwise allow access
  return <Outlet />;
}

export default ProtectedRoute;

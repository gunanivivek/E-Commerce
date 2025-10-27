import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  // If user is not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Otherwise allow access
  return <Outlet />;
}

export default ProtectedRoute;

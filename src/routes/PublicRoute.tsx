import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types/auth";


export default function PublicRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    const role = (user.role as UserRole)?.toLowerCase();

    switch (role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "seller":
        return <Navigate to="/seller" replace />;
      case "customer":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

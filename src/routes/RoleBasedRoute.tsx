import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

type UserRole = "admin" | "seller" | "customer";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  const rawRole = user.role?.toLowerCase();
  const role = ["admin", "seller", "customer"].includes(rawRole)
    ? (rawRole as UserRole)
    : undefined;

  if (!role) {
    return <Navigate to="/unauthorized" replace />;
  }


  if (!allowedRoles.includes(role)) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "seller":
        return <Navigate to="/seller" replace />;
      case "customer":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ Otherwise allow access
  return <Outlet />;
};

export default RoleBasedRoute;

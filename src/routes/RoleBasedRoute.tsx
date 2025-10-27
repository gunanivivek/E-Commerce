import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

interface RoleBasedRouteProps {
  allowedRoles: Array<"admin" | "seller" | "customer">;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  // If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but their role isn't allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise allow access
  return <Outlet />;
};

export default RoleBasedRoute;

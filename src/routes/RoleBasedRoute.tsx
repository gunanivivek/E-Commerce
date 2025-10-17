import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuthStore();
  const role = useAuthStore((state) => state.role);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;

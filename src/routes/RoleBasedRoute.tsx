import { Navigate, Outlet } from "react-router";

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

interface User {
  role: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {

  const user: User | null = { role: "seller" }; 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;

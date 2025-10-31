import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

const OpenCustomerRoute = () => {
  const user = useAuthStore((state) => state.user);

  // 🧠 If admin or seller is logged in → redirect to their dashboard
  if (user) {
    const role = user.role?.toLowerCase();
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "seller") return <Navigate to="/seller" replace />;
  }

  // ✅ Otherwise, show public customer content
  return <Outlet />;
};

export default OpenCustomerRoute;

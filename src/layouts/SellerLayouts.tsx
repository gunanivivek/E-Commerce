import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar";

const SellerLayouts = () => {
  return (
    <div className="flex flex-row min-h-screen">
      <DashboardSidebar />
      <div className="w-full bg-primary-400/10 pt-10 lg:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayouts;

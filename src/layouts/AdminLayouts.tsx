import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar";



const AdminLayouts = () => {
  
  return (
    <div className="flex flex-row min-h-screen">
      <DashboardSidebar />
      <div className="w-full bg-white pt-10 lg:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayouts;

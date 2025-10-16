import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayouts = () => {
  return (
    <div className="flex flex-row min-h-screen">
      <AdminSidebar />
      <div className="w-full bg-primary-400/10 pt-10 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayouts;

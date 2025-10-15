import { Outlet } from "react-router";

import SellerSidebar from "../components/seller/SellerSidebar";

const SellerLayouts = () => {
  return (
    <div className="flex flex-row min-h-screen">
      <SellerSidebar />
      <div className="w-full bg-primary-400/10 pt-10 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayouts;

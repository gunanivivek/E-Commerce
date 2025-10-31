import { Routes, Route } from "react-router";
import Unauthorized from "./pages/Unauthorized";
import RoleBasedRoute from "./routes/RoleBasedRoute";

import Login from "./pages/Login";
import CustomerLayouts from "./layouts/CustomerLayouts";
import TestDashboard from "./pages/TestDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AdminLayouts from "./layouts/AdminLayouts";
import Test from "./pages/Test";
import SellerLayouts from "./layouts/SellerLayouts";
import AdminProfile from "./pages/Admin/AdminProfile";
import About from "./pages/Customer/About";
import PublicRoute from "./routes/PublicRoute";
import OpenCustomerRoute from "./routes/OpenCustomerRoute";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminProductList from "./pages/Admin/AdminProductList";
import SellerProductList from "./pages/Seller/SellerProductList";
import SellerList from "./pages/Admin/SellerList";
import CustomerList from "./pages/Admin/CustomerList";
import CategoryList from "./pages/Admin/CategoryList";
import SellerProfilePage from "./pages/Seller/SellerProfilePage";


function App() {
  return (
    <Routes>
      {/* Public routes (only for guests) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Open Customer Routes (accessible to everyone) */}
      <Route element={<OpenCustomerRoute />}>
        <Route path="/" element={<CustomerLayouts />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Admin */}
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayouts />}>
            <Route index element={<TestDashboard />} />
            <Route path="sellers" element={<SellerList />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="category" element={<CategoryList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="coupons" element={<Test />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>


        <Route element={<RoleBasedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller" element={<SellerLayouts />}>
            <Route index element={<TestDashboard />} />
            <Route path="products" element={<SellerProductList />} />
            <Route path="coupons" element={<Test />} />
            <Route path=":sellerId" element={<SellerProfilePage />} />
          </Route>
        </Route>

        {/* Customer private pages */}
        <Route element={<RoleBasedRoute allowedRoles={["customer"]} />}>
          <Route path="/profile" element={<CustomerLayouts />}>
            <Route index element={<TestDashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* ✅ Always show NotFound for missing paths (even if not logged in) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
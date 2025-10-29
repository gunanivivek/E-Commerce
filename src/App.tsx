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
import SellerProfile from "./pages/Seller/SellerProfile";
import AdminProfile from "./pages/Admin/AdminProfile";
import About from "./pages/Customer/About";
import PublicRoute from "./routes/PublicRoute";
import SignUp from "./pages/SignUp";
import AdminProductList from "./pages/Admin/AdminProductList";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerList from "./pages/Admin/CustomerList";
import SellerList from "./pages/Admin/SellerList";
import SellerProductList from "./pages/Seller/SellerProductList";
import CategoryList from "./pages/Admin/CategoryList";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      {/* Customer-only routes */}
      <Route path="/" element={<CustomerLayouts />}>
        <Route index element={<TestDashboard />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<CustomerLayouts />}>
        <Route index element={<TestDashboard />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route path="*" element={<NotFound />} />
        {/* Admin-only routes */}
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

        {/* Seller-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller" element={<SellerLayouts />}>
            <Route index element={<TestDashboard />} />
            <Route path="sellers" element={<Test />} />
            <Route path="products" element={<SellerProductList />} />
            <Route path="coupons" element={<Test />} />
            <Route path="profile" element={<SellerProfile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router";
import Unauthorized from "./pages/Unauthorized";
import RoleBasedRoute from "./routes/RoleBasedRoute";

import Login from "./pages/Login";
import CustomerLayouts from "./layouts/CustomerLayouts";
import Products from "./pages/Customer/Products";
import TestDashboard from "./pages/TestDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AdminLayouts from "./layouts/AdminLayouts";
import SellerLayouts from "./layouts/SellerLayouts";
import AdminProfile from "./pages/Admin/AdminProfile";
import About from "./pages/Customer/About";
import Contact from "./pages/Customer/Contact";
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
import { useFetchCategories } from "./hooks/useFetchCategories";
import ProductsDescription from "./pages/Customer/ProductsDescription";
import Cart from "./pages/Customer/Cart";
import Profile from "./pages/Customer/CustomerProfile";
import AccountInfo from "./components/Customer/AccountInfo";
import Orders from "./components/Customer/Orders";
import ChangePassword from "./components/Customer/ChangePassword";
import SellerOrders from "./pages/Seller/SellerOrders";
import AddresssInfo from "./components/Customer/AddresssInfo";
import Wishlist from "./pages/Customer/Wishlist";
import AdminOrderList from "./pages/Admin/AdminOrderList";
import Checkout from "./pages/Customer/Checkout";
import SellerCoupons from "./pages/Seller/SellerCoupons";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import CategoryPage from "./pages/Customer/CategoryPage";
import NewArrivals from "./pages/Customer/NewArrivals";

function App() {
  useFetchCategories();
  return (
    <>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:category_name" element={<CategoryPage />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/product/:productId" element={<ProductsDescription />} />
        </Route>

        {/* Customer private pages */}
        <Route element={<RoleBasedRoute allowedRoles={["customer"]} />}>
          <Route path="profile" element={<Profile />}>
            <Route index element={<AccountInfo />} />
            <Route path="orders" element={<Orders />} />
            <Route path="address" element={<AddresssInfo />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
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
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="orders" element={<AdminOrderList />} />
            </Route>
          </Route>

          {/* Seller */}
          <Route element={<RoleBasedRoute allowedRoles={["seller"]} />}>
            <Route path="/seller" element={<SellerLayouts />}>
              <Route index element={<TestDashboard />} />
              <Route path="products" element={<SellerProductList />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="coupons" element={<SellerCoupons />} />
              <Route path=":sellerId" element={<SellerProfilePage />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/*  Always show NotFound for missing paths (even if not logged in) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

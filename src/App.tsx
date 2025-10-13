import { Routes, Route } from "react-router";
import Unauthorized from "./pages/Unauthorized";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import Login from "./pages/Login";
import TestLayout from "./layouts/TestLayout";
import TestDashboard from "./pages/TestDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
   
      <Route path="/" element={<TestLayout />}>
        <Route index element={<TestDashboard />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route path="*" element={<NotFound />} />
        {/* Admin-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<TestLayout />}>
            <Route index element={<TestDashboard />} />
          </Route>
        </Route>

        {/* Seller-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller" element={<TestLayout />}>
            <Route index element={<TestDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

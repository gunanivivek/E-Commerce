import {  Routes, Route } from "react-router";
import Unauthorized from "./pages/Unauthorized";

import RoleBasedRoute from "./routes/RoleBasedRoute";
import Login from "./pages/Login";
import TestLayout from "./layouts/TestLayout";
import TestDashboard from "./pages/TestDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (

    
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

      
          <Route element={<ProtectedRoute />}>
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

            {/* Customer-only routes */}
            <Route element={<RoleBasedRoute allowedRoles={["customer"]} />}>
              <Route path="/" element={<TestLayout />}>
                <Route index element={<TestDashboard />} />
              </Route>
            </Route>
          </Route>
        </Routes>
  
  );
}

export default App;

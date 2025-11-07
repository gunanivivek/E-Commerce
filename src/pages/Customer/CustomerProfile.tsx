import { Outlet } from "react-router";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { NavLink } from "react-router";
import { User2, Package, RefreshCw, Lock, User2Icon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const CustomerProfileLayout = () => {
  const { user } = useAuthStore();

  const menuItems = [
    { label: "My Account", icon: User2, path: "" },
    { label: "My Orders", icon: Package, path: "orders" },
    { label: "Address", icon: RefreshCw, path: "address" },
    { label: "Change Password", icon: Lock, path: "change-password" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-6 md:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

      
          <aside className=" rounded-lg shadow-md p-6 h-auto md:h-[calc(100vh-160px)] transition-all duration-300 border border-gray-200">
            <div className="text-center mb-6">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-[var(--color-accent)] object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-[var(--color-accent)] flex items-center justify-center bg-gray-100">
                  <User2Icon className="w-10 h-10 text-gray-500" />
                </div>
              )}

              <h3 className="font-semibold text-lg text-[var(--color-primary-400)]">{user?.full_name}</h3>
              <p className="text-sm text-gray-600">Hello 👋</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === ""}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[var(--color-accent)] text-white font-semibold shadow-sm hover:shadow-md transform "
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main Content Card */}
          <section className="md:col-span-3  rounded-lg shadow-md p-8 border border-gray-200">
            <Outlet />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfileLayout;
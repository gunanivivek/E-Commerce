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
    <div className="flex flex-col min-h-screen bg-background text-gray-200">
      <Header />

      <main className="flex-grow container  mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="rounded-xl p-6 border border-gray-700 bg-surface-light h-auto md:h-[calc(100vh-120px)]">
            <div className="text-center mb-6">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-accent object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-accent flex items-center justify-center bg-gray-800">
                  <User2Icon className="w-10 h-10 text-[var(--color-gray-500)]" />
                </div>
              )}

             
              <h3 className="font-semibold text-lg text-white">
                {user?.full_name}
              </h3>
              <p className="text-sm text-gray-400">Hello 👋</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === ""}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                    ${
                      isActive
                        ? "bg-white text-accent"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} className="text-accent" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <section className="md:col-span-3 bg-surface-light border border-gray-700 rounded-xl p-8">
            <Outlet />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfileLayout;

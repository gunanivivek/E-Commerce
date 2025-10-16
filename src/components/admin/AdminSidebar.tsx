import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Ticket,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;

}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Sellers", href: "/admin/sellers", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (): void => setIsOpen(!isOpen);
  const closeSidebar = (): void => setIsOpen(false);

  return (
    <>
      {!isOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg bg-primary-300 text-white hover:bg-primary-400 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:sticky lg:top-0 lg:left-0 bg-white h-screen w-[250px] min-w-[250px] max-w-[250px] border-r border-primary-border flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary-border">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-primary-400 min-w-0">
                <h1 className="font-bold text-sidebar-foreground truncate">
                  Merchant Hub
                </h1>
                <p className="text-xs font-semibold text-muted-foreground truncate">
                  Admin Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 md:hidden rounded-full bg-primary-300 text-white hover:bg-primary-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 p-4 space-y-1 overflow-y-auto">
          <h3 className="text-xs text-primary-400 px-3 font-semibold">
            Navigation
          </h3>
          <nav className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <NavLink
                to={item.href}
                end={item.href === "/admin"} // only exact match for root dashboard
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-200/60 text-primary-400"
                      : "text-primary-400 hover:bg-primary-200/30"
                  }`
                }
                onClick={closeSidebar}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer with Profile */}

        <div className="p-4 border-t border-primary-border">
          <NavLink
            to="/admin/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-primary-200/20 rounded-lg"
            onClick={closeSidebar}
          >
            <div className="w-8 h-8 rounded-full bg-primary-100/50  flex items-center justify-center">
              <span className="font-semibold text-xs">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary-400 truncate">
                admin@craveat.com
              </p>
              <p className="text-xs text-primary-400">Admin Account</p>
            </div>
          </NavLink>
          <button className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary-400 hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store/headerStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";


const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { cartCount } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black  border-orange-500">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="md:hidden p-2 text-white hover:text-orange-500">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center space-x-4">
         
            <span className="hidden font-logo ml-8 font-bold text-2xl md:inline-block text-white">
            Cartify
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 px-20">
            <Link
              to="/products"
              className="text font-semibold text-white transition-colors hover:text-orange-500"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text font-semibold text-white transition-colors hover:text-orange-500"
            >
              Categories
            </Link>
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-10 border bg-white rounded-md py-2 px-4 w-full   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate("/wishlist")}
                className="p-2 text-white hover:text-orange-500"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 cursor-pointer" />
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-2 text-white hover:text-orange-500"
                aria-label="Profile"
              >
                <User className="h-5 w-5 cursor-pointer" />
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 cursor-pointer text-white hover:text-orange-500"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <div className="cursor-pointer absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs rounded-full">
                    {cartCount}
                  </div>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="p-2 cursor-pointer text-white font-bold hover:text-orange-500"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="p-2 cursor-pointer text-white font-bold hover:text-orange-500"
              aria-label="Login"
            >
              <LogIn className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
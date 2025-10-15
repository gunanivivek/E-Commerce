import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  LogIn,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "../store/headerStore"; // Zustand store

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, isLoggedIn, setIsLoggedIn } = useStore(); // Zustand store
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Sync login state across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "authToken") {
        const isAuthenticated = Boolean(e.newValue);
        setIsLoggedIn(isAuthenticated);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setIsLoggedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary-100 backdrop-blur supports-[backdrop-filter]:bg-primary-100">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="md:hidden p-2 text-primary-400 hover:text-primary-600">
            <Menu className="h-5 w-5" />
          </button>
          <a href="/" className="flex items-center space-x-2">
            <div className="ml-3 h-8 w-8 rounded-lg bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <span className="text-primary-100 font-bold text-lg">S</span>
            </div>
            <span className="hidden font-bold text-xl md:inline-block text-primary-400">
              ShopEase
            </span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary-400"
            >
              Products
            </a>
            <a
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary-400"
            >
              Categories
            </a>
          </nav>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-10 border rounded-md py-2 px-4 w-full border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Cart, Wishlist, Profile, and Login Buttons */}
        <div className="flex items-center gap-2">
          {/* Wishlist - Only visible if logged in */}
          {isLoggedIn && (
            <button onClick={() => navigate("/wishlist")} className="p-2 text-primary-400 hover:text-primary-600">
              <Heart className="h-5 w-5 cursor-pointer" />
            </button>
          )}

          {/* Profile - Only visible if logged in */}
          {isLoggedIn && (
            <button onClick={() => navigate("/profile")} className="p-2 text-primary-400 hover:text-primary-600">
              <User className="h-5 w-5 cursor-pointer" />
            </button>
          )}

          {/* Cart - Always visible but conditionally show cart count */}
          {isLoggedIn && (
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 cursor-pointer text-primary-400 hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <div className="cursor-pointer absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white text-xs rounded-full">
                  {cartCount}
                </div>
              )}
            </button>
          )}

          {/* Login/Logout Button */}
          <button
            onClick={() => navigate(isLoggedIn ? "/logout" : "/login")}
            className="p-2 cursor-pointer text-primary-400 hover:text-primary-600"
          >
            {isLoggedIn ? (
              <LogOut className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

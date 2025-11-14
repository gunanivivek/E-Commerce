import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  LogIn,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/Customer/useCartHooks";

const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // ✅ Search on Enter or click, redirect to /search?query=
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
      setIsMobileSearchOpen(false);
    } else {
      toast.info("Please enter something to search");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

   const handleNavigationCart = (path: string) => {
    refetchCart(); // fetch the latest cart items
    navigate(path); // navigate to the cart page
  };

    const { refetch: refetchCart, data: cartData } = useCart();

     const cartCount = cartData?.items?.length ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background ">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* 🔹 Left Section */}
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-accent-dark hover:text-light"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center">
              <span className="font-logo font-bold text-2xl md:text-3xl tracking-wider text-accent-darker">
                Cartify
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-4 lg:gap-6 ml-4 lg:ml-8">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="text-base lg:text-lg font-semibold font-logo text-accent-dark hover:cursor-pointer transition-colors hover:text-light whitespace-nowrap"
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => navigate("/new-arrivals")}
                className="text-base lg:text-lg font-semibold font-logo text-accent-dark hover:cursor-pointer transition-colors hover:text-light whitespace-nowrap"
              >
                Fresh Drops
              </button>
            </nav>
          </div>

          {/* 🔹 Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search
                onClick={() => handleSearch()}
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 cursor-pointer"
              />
              <input
                type="search"
                placeholder="Search products..."
                className="pl-10 border bg-white rounded-md py-2 px-4 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-border focus:border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* 🔹 Right Section */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Mobile search icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-accent-dark hover:text-light"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <>
                {/* Wishlist */}
                <button
                  onClick={() => handleNavigation("/wishlist")}
                  className="p-2 hover:cursor-pointer text-accent-dark hover:text-light"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5 cursor-pointer" />
                </button>

                {/* Cart */}
                <button
                  onClick={() => handleNavigationCart("/cart")}
                  className="relative p-2 hover:cursor-pointer text-accent-dark hover:text-light"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="cursor-pointer absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-accent-dark hover:text-light text-xs rounded-full">
                      {cartCount}
                    </div>
                  )}
                </button>

                {/* Profile */}
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="p-2 hover:cursor-pointer text-accent-dark hover:text-light"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5 cursor-pointer" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="flex text-sm bg-accent-light/40 rounded-xl px-4 py-2 justify-center flex-row items-center gap-1  hover:cursor-pointer text-accent-dark hover:text-accent-darker"
                aria-label="Login"
              >
                <span className="font-semibold">Login</span> 
                <LogIn className="h-5 w-5" />
               
              </button>
            )}
          </div>
        </div>

        {/* 🔹 Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-4 border-t border-orange-500/30">
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative w-full">
                <Search
                  onClick={() => handleSearch()}
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 border bg-white rounded-md py-2 px-4 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-border focus:border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </header>

      {/* 🔹 Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🔹 Mobile Sidebar Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-background transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <span className="font-logo font-bold text-2xl tracking-wider text-accent-darker">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-accent-dark hover:text-light"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-2">
            <button
              onClick={() => handleNavigation("/products")}
              className="text-left text-lg font-semibold font-logo text-accent-dark hover:text-light py-3 px-2 rounded transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => handleNavigation("/new-arrivals")}
              className="text-left text-lg font-semibold font-logo text-accent-dark hover:text-light py-3 px-2 rounded transition-colors"
            >
              Fresh Drops
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div className="border-t bg-primary-100">
      <div className="container pt-12 px-6 md:pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                <span className="text-primary-100 font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-primary-400">
                ShopEase
              </span>
            </div>
            <p className="text-sm text-primary-300">
              Your trusted destination for quality products at unbeatable
              prices.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="p-2 text-primary-400 hover:text-primary-600 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 text-primary-400 hover:text-primary-600 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 text-primary-400 hover:text-primary-600 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Shop</h3>
            <ul className="space-y-3 text-sm text-primary-300">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-primary-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="hover:text-primary-400 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Support</h3>
            <ul className="space-y-3 text-sm text-primary-300">
              <li>
                <Link
                  to="/help-center"
                  className="hover:text-primary-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-info"
                  className="hover:text-primary-400 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns-refunds"
                  className="hover:text-primary-400 transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Newsletter</h3>
            <p className="text-sm text-primary-300 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex gap-2">
              {/* Manually creating the input field */}
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 p-2 border-2 border-primary-300 rounded-md text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {/* Manually creating the button with icon */}
              <button className="p-2 text-primary-400 bg-primary-100 hover:bg-primary-200 rounded-md">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="m-6 pt-6 border-t text-center text-sm text-primary-300">
          <p>
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link
              to="/privacy-policy"
              className="hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              to="/terms-conditions"
              className="hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

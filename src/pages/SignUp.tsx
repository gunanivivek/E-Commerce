import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import SellerSignupForm from "../components/SellerSignUpForm";
import BuyerSignupForm from "../components/BuyerSignUpForm";

type UserType = "customer" | "seller";

export default function Signup() {
  const [userType, setUserType] = useState<UserType>("customer");
  const navigate = useNavigate();


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden bg-background">
        <div
          className="
            relative mt-10 rounded-xl p-6 sm:p-8
            w-full max-w-md sm:max-w-lg text-center
            bg-background backdrop-blur-sm
            border border-border
            shadow-xl mb-15
          "
        >
          <h2
            className="
              text-2xl sm:text-3xl font-heading font-black mb-2 leading-tight
              text-text-primary
            "
          >
            Create Account
          </h2>

          <p
            className="
              text-base sm:text-lg mb-6 leading-relaxed
              text-text-secondary font-body
            "
          >
            Join as a {userType === "customer" ? "Customer" : "Seller"}
          </p>

          {/* Role Tabs */}
          <div className="flex bg-primary-100 rounded-full mb-6 p-1 overflow-hidden">
            <button
              type="button"
              onClick={() => setUserType("customer")}
              className={`w-1/2 py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-[var(--transition-fast)] hover:cursor-pointer ${
                userType === "customer"
                  ? "bg-accent text-text-primary font-bold"
                  : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setUserType("seller")}
              className={`w-1/2 py-3 text-sm sm:text-base font-semibold rounded-[var(--radius-full)] transition-all duration-[var(--transition-fast)] hover:cursor-pointer ${
                userType === "seller"
                  ? "bg-accent text-text-primary"
                  : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"
              }`}
            >
              Seller
            </button>
          </div>

          {userType === "customer" ? <BuyerSignupForm /> : <SellerSignupForm /> }

          <p className="text-base sm:text-lg mt-6 pt-4 border-t border-[var(--color-border)] text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/login");
              }}
              className="font-semibold text-accent hover:underline hover:cursor-pointer transition-colors duration-[var(--transition-fast)]"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useSignUp";
import type {
  SignupRequest,
  BuyerSignupRequest,
  SellerSignupRequest,
} from "../types/auth";
import { useNavigate } from "react-router";

type UserType = "customer" | "seller";

export default function Signup() {
  const [userType, setUserType] = useState<UserType>("customer");
  const navigate = useNavigate();

  const signupMutation = useSignUp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<
    (BuyerSignupRequest & SellerSignupRequest) & { confirmPassword: string }
  >();

  const password = watch("password");

  const handleSignup = (data: SignupRequest) => {
    const payload = { ...data, role: userType };
    signupMutation.mutate(payload, {
      onSuccess: () => {
        navigate(userType === "customer" ? "/" : "/seller");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,var(--color-accent)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,var(--color-accent)_0%,transparent_50%)]"></div>
      </div>
      
      <div 
        className="relative mt-10 rounded-[var(--radius-xl)] p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center shadow-[var(--shadow-xl)] border border-[var(--color-gray-700)] backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.8)', // Semi-transparent for subtle glassmorphism
          backdropFilter: 'blur(10px)'
        }}
      >


        <h2 
          className="text-2xl sm:text-3xl font-black mb-2 leading-tight"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-white)'
          }}
        >
          Create Account
        </h2>
        <p 
          className="text-base sm:text-lg mb-6 leading-relaxed"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)'
          }}
        >
          Join as a {userType === "customer" ? "Customer" : "Seller"}
        </p>

        {/* Role Tabs */}
        <div className="flex bg-[var(--color-gray-700)] rounded-[var(--radius-full)] mb-6 p-1 overflow-hidden">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={`w-1/2 py-3 text-sm sm:text-base font-semibold rounded-[var(--radius-full)] transition-all duration-[var(--transition-fast)] hover:cursor-pointer ${userType === "customer" ? 'bg-[var(--color-surface-light)] text-[var(--color-white)]' : 'text-[var(--color-gray-500)] hover:bg-[var(--color-gray-600)]'}`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserType("seller")}
            className={`w-1/2 py-3 text-sm sm:text-base font-semibold rounded-[var(--radius-full)] transition-all duration-[var(--transition-fast)] hover:cursor-pointer ${userType === "seller" ? 'bg-[var(--color-surface-light)] text-[var(--color-white)]' : 'text-[var(--color-gray-500)] hover:bg-[var(--color-gray-600)]'}`}
          >
            Seller
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="space-y-4 text-left"
        >
          {/* Full Name */}
          <div>
            <label 
              htmlFor="full_name"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              {...register("full_name", { required: "Full name is required" })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${errors.full_name ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                color: 'var(--color-white)'
              }}
            />
            {errors.full_name && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Seller-only fields */}
          {userType === "seller" && (
            <>
              <div>
                <label 
                  htmlFor="store_name"
                  className="block text-sm mb-1 font-medium"
                  style={{ 
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Store Name
                </label>
                <input
                  id="store_name"
                  type="text"
                  placeholder="Your Store Name"
                  {...register("store_name", {
                    required: "Store name is required",
                  })}
                  className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid ${errors.store_name ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                    color: 'var(--color-white)'
                  }}
                />
                {errors.store_name && (
                  <p 
                    className="text-sm mt-1"
                    style={{ 
                      color: 'var(--color-error)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="store_address"
                  className="block text-sm mb-1 font-medium"
                  style={{ 
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Store Address
                </label>
                <input
                  id="store_address"
                  type="text"
                  placeholder="Enter your store's address"
                  {...register("store_address", {
                    required: "Store address is required",
                  })}
                  className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid ${errors.store_address ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                    color: 'var(--color-white)'
                  }}
                />
                {errors.store_address && (
                  <p 
                    className="text-sm mt-1"
                    style={{ 
                      color: 'var(--color-error)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {errors.store_address.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Phone */}
          <div>
            <label 
              htmlFor="phone"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Phone Number {userType === "seller" && <span style={{ color: 'var(--color-error)' }}>*</span>}
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+91XXXXXXXXXX"
              {...register("phone", {
                required:
                  userType === "seller" ? "Phone number is required" : false,
                pattern: {
                  value: /^\+91\d{10}$/, // must start with +91 and followed by 10 digits
                  message:
                    "Phone number must start with +91 and contain 10 digits",
                },
              })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${errors.phone ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                color: 'var(--color-white)'
              }}
            />
            {errors.phone && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${errors.email ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                color: 'var(--color-white)'
              }}
            />
            {errors.email && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: 6,
              })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                color: 'var(--color-white)'
              }}
            />
            {errors.password && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {errors.password.message ||
                  "Password must be at least 6 characters"}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${errors.confirmPassword ? 'var(--color-error)' : 'var(--color-gray-600)'}`,
                color: 'var(--color-white)'
              }}
            />
            {errors.confirmPassword && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className={`w-full py-3 rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--transition-normal)] disabled:opacity-70 disabled:cursor-not-allowed ${signupMutation.isPending ? '' : 'hover:scale-105'}`}
            style={{
              background: 'var(--gradient-orange)',
              color: 'var(--color-white)',
              border: 'none',
              boxShadow: 'var(--shadow-orange)'
            }}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>

          {/* Error message */}
          {signupMutation.isError && (
            <p 
              className="mt-2 text-center"
              style={{ 
                color: 'var(--color-error)',
                fontFamily: 'var(--font-body)'
              }}
            >
              {(signupMutation.error as Error).message}
            </p>
          )}
        </form>

        <p 
          className="text-base sm:text-lg mt-6 pt-4 border-t border-[var(--color-gray-700)]"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)'
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="hover:text-[var(--color-accent)] transition-colors duration-[var(--transition-fast)] font-semibold"
            style={{ 
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)'
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
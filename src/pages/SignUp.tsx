import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useSignUp";
import type { SignupRequest, BuyerSignupRequest, SellerSignupRequest } from "../types/auth";
import { useNavigate } from "react-router";

type UserType = "customer" | "seller";

export default function Signup() {
  const [userType, setUserType] = useState<UserType>("customer");
  const navigate =  useNavigate();

  const signupMutation = useSignUp();

    const { register, handleSubmit, watch, formState: { errors } } =
      useForm<(BuyerSignupRequest & SellerSignupRequest) & { confirmPassword: string }>();

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 md:px-8">
      <div className="bg-white rounded-xl m-5 shadow-md p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary-400">
          Create Account
        </h2>
        <p className="text-primary-400 mb-6 text-base sm:text-lg mt-1">
          Join as a {userType === "customer" ? "Customer" : "Seller"}
        </p>

        {/* Role Tabs */}
        <div className="flex bg-primary-200 rounded-3xl mb-6 p-1.5 overflow-hidden">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={`w-1/2 py-1 text-sm sm:text-base font-medium rounded-2xl transition hover:cursor-pointer ${
              userType === "customer" ? "bg-background text-primary-400" : "text-gray-500"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserType("seller")}
            className={`w-1/2 py-1 text-sm sm:text-base font-medium rounded-2xl transition hover:cursor-pointer ${
              userType === "seller" ? "bg-background text-primary-400" : "text-gray-500"
            }`}
          >
            Seller
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-base mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("full_name", { required: "Full name is required" })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
            {errors.full_name && <p className="text-red-400 text-sm mt-1">{errors.full_name.message}</p>}
          </div>

          {/* Seller-only fields */}
          {userType === "seller" && (
            <>
              <div>
                <label className="block text-gray-700 text-base mb-1">Store Name</label>
                <input
                  type="text"
                  placeholder="Your Store Name"
                  {...register("store_name", { required: "Store name is required" })}
                  className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
                />
                {errors.store_name && <p className="text-red-400 text-sm mt-1">{errors.store_name.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-base mb-1">Store Address</label>
                <input
                  type="text"
                  placeholder="Enter your store's address"
                  {...register("store_address", { required: "Store address is required" })}
                  className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
                />
                {errors.store_address && <p className="text-red-400 text-sm mt-1">{errors.store_address.message}</p>}
              </div>
            </>
          )}

          {/* Phone */}
          <div>
            <label className="block text-gray-700 text-base mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              {...register("phone", { required: userType === "seller" })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">Phone number is required</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-base mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-base mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message || "Password must be at least 6 characters"}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-base mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-300 hover:bg-[#95b494] text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            Sign Up
          </button>
        </form>

        <p className="text-base sm:text-lg text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary-300 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

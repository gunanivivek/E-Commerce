// src/components/forms/SellerSignupForm.tsx
import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useSignUp";
import type { SellerSignupRequest, SignupRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";

export default function SellerSignupForm() {
  const signupMutation = useSignUp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SellerSignupRequest & { confirmPassword: string }>();

  const password = watch("password");

  const handleSignup = (data: SignupRequest) => {
    signupMutation.mutate({ ...data, role: "seller" }, {
      onSuccess: () => navigate("/seller"),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSignup)} className="space-y-4 text-left font-body">
      {/* Full Name */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Full Name <span className="text-error">*</span>
        </label>
        <input
          {...register("full_name", { required: "Full name is required" })}
          placeholder="Enter your full name"
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary 
            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent
            transition-all duration-200 ${
              errors.full_name ? "border-error" : "border-border"
            }`}
        />
        {errors.full_name && (
          <p className="text-sm mt-1 text-error">{errors.full_name.message}</p>
        )}
      </div>

      {/* Store Name */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Store Name <span className="text-error">*</span>
        </label>
        <input
          {...register("store_name", { required: "Store name is required" })}
          placeholder="Your Store Name"
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.store_name ? "border-error" : "border-border"
          }`}
        />
        {errors.store_name && (
          <p className="text-sm mt-1 text-error">{errors.store_name.message}</p>
        )}
      </div>

      {/* Store Address */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Store Address <span className="text-error">*</span>
        </label>
        <input
          {...register("store_address", { required: "Store address is required" })}
          placeholder="Enter your store's address"
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.store_address ? "border-error" : "border-border"
          }`}
        />
        {errors.store_address && (
          <p className="text-sm mt-1 text-error">{errors.store_address.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Phone Number <span className="text-error">*</span>
        </label>
        <input
          type="tel"
          placeholder="+91XXXXXXXXXX"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^\+91\d{10}$/,
              message: "Phone number must start with +91 and contain 10 digits",
            },
          })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.phone ? "border-error" : "border-border"
          }`}
        />
        {errors.phone && (
          <p className="text-sm mt-1 text-error">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.email ? "border-error" : "border-border"
          }`}
        />
        {errors.email && (
          <p className="text-sm mt-1 text-error">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Password<span className="text-error">*</span>
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters required" },
          })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.password ? "border-error" : "border-border"
          }`}
        />
        {errors.password && (
          <p className="text-sm mt-1 text-error">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:ring-accent ${
            errors.confirmPassword ? "border-error" : "border-border"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-sm mt-1 text-error">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={signupMutation.isPending}
        className="w-full py-3 rounded-lg font-semibold bg-accent hover:bg-accent-light text-white shadow-accent hover:scale-[1.02] transition-all disabled:opacity-70"
      >
        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}

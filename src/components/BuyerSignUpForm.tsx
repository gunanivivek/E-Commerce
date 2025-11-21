import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useSignUp";
import type { BuyerSignupRequest, SignupRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";

export default function BuyerSignupForm() {
  const signupMutation = useSignUp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BuyerSignupRequest & { confirmPassword: string }>();

  const password = watch("password");

const handleSignup = (data: SignupRequest) => {
  
  const finalData: BuyerSignupRequest = {
    ...data,
    phone: "+91" + data.phone,
    role: "customer",
  };

  signupMutation.mutate(finalData, {
    onSuccess: () => navigate("/"),
  });
};


  return (
    <form
      onSubmit={handleSubmit(handleSignup)}
      className="space-y-4 text-left font-body"
    >
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

      {/* Phone (optional) */}
   <div>
  <label className="block text-sm mb-1 font-medium text-text-primary">
    Phone Number<span className="text-error">*</span>
  </label>

 <input
  type="tel"
  placeholder="e.g. 9876543210"
  {...register("phone", {
    required: "Phone number is required",
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
    onChange: (e) => {
      // Ensure only digits (no spaces, no +91)
      e.target.value = e.target.value.replace(/\D/g, "");
    },
  })}
  className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 ${
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
          className={`w-full rounded-md px-3 py-3 bg-background border focus:outline-none text-text-primary focus:ring-2 focus:ring-accent ${
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
          Password <span className="text-error">*</span>
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:outline-none focus:ring-accent ${
            errors.password ? "border-error" : "border-border"
          }`}
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm mb-1 font-medium text-text-primary">
          Confirm Password <span className="text-error">*</span>
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`w-full rounded-md px-3 py-3 bg-background border text-text-primary focus:ring-2 focus:outline-none focus:ring-accent ${
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
        className="w-full py-3 rounded-lg font-semibold bg-accent text-white
                hover:bg-accent-light shadow-accent hover:cursor-pointer transition-all disabled:opacity-70"
      >
        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}

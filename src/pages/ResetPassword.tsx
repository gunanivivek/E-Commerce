/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axiosInstance";
import { showToast } from "../components/toastManager";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ extract token from query params

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        token,
        new_password: data.password,
      });
      showToast(res.data.message || "Password reset successful!", "success");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h3 className="text-3xl font-semibold text-primary-400 text-start mb-2">
          Create New Password
        </h3>
        <p className="text-start text-primary-400 mb-6">
          Set a strong new password to secure your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-lg text-primary-400 font-medium">
              New Password
            </label>
            <input
              type="password"
              className="w-full bg-background focus:border focus:border-primary-400 rounded p-2.5"
              placeholder="Enter new password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-lg text-primary-400 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full bg-background focus:border focus:border-primary-400 rounded p-2.5"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-200 text-white py-2 rounded hover:cursor-pointer hover:bg-primary-400 transition"
            >
              {loading ? "Please wait..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-background py-2 rounded hover:bg-gray-50 transition"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const loginMutation = useLogin();
  const onSubmit = (data: LoginForm) => {
    // reset messages first
    setErrorMessage(null);
    setSuccessMessage(null);

    if (data.email === "admin@example.com" && data.password === "admin123") {
      setSuccessMessage("Login Successful!");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } else {
      setErrorMessage("Invalid credentials. Try admin@example.com / admin123");
    }

    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 md:px-8">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary-400">
          Merchant Hub
        </h2>
        <p className="text-primary-400 mb-6 text-base sm:text-lg mt-1">
          Welcome back admin! Login to manage your site
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              {...register("email", { required: true })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
          </div>

          <p className="text-sm sm:text-base text-gray-600 mt-4">
            <a
              href="/forgotPassword"
              className="text-primary-400 hover:underline font-medium"
            >
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`p-2 rounded text-white ${
              loginMutation.isPending
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Show success or error message */}
          {errorMessage && (
            <p className="text-red-500 mt-3 text-sm font-medium text-center">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 mt-3 text-sm font-medium text-center">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

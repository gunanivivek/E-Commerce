import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { forgotPassword } from "../api/authApi";

interface FormData {
  email: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "" },
  });

  const sendEmail = async (email: string) => {
    try {
      const res = await forgotPassword({ email });
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.detail || "Failed to send reset email"
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await sendEmail(data.email);
      toast.success("Email sent successfully to reset the password");
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.message ||
        (typeof err === "string" ? err : "Failed to send reset email");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-background relative overflow-hidden text-[var(--color-text-primary)]">
      <div
        className="
          relative rounded-[var(--radius-xl)]
          p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center
          bg-primary- backdrop-blur-sm
          border border-[var(--color-border)]
          shadow-[var(--shadow-xl)]
        "
      >
        {/* Logo / Title */}
        <div
            className="
              mx-auto font-logo font-stretch-expanded text-5xl mb-2
               flex items-center justify-center
               text-accent-darker
            "
          >
            Cartify
          </div>
        <h3
          className="
            text-3xl sm:text-2xl font-heading mb-2
            text-text-primary
          "
        >
          Reset Password
        </h3>

        <p
          className="
            text-base sm:text-lg mb-6 leading-relaxed
            text-text-secondary font-body
          "
        >
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-1 font-medium text-text-primary font-body"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
              className={`
                w-full rounded-[var(--radius-md)] px-3 py-3
                bg-surface-light
                border border-border
                text-text-primary
                placeholder:text-text-muted
                focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
                transition-all duration-[var(--transition-fast)]
                ${errors.email ? "border-[var(--color-error)]" : ""}
              `}
            />
            {errors.email && (
              <p className="text-sm mt-1 text-[var(--color-error)] font-body">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-lg font-semibold
                transition-all duration-[var(--transition-normal)]
                bg-accent text-primary-100
                shadow-accent
                hover:bg-accent-light 
                hover:cursor-pointer
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {loading ? "Please wait..." : "Send Link to Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                w-full py-3 rounded-lg font-semibold
                hover:cursor-pointer
                border border-border
                text-text-secondary
                bg-background hover:bg-gray-50
                hover:text-text-primary
                transition-all duration-[var(--transition-normal)]
              "
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

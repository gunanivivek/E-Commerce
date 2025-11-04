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

  // Dummy async function for now. Will change it to the real one
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
      navigate("/login")
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden" >
      {/* Subtle Unique Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,var(--color-accent)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,var(--color-accent)_0%,transparent_50%)]"></div>
      </div>
      
      <div 
        className="relative rounded-[var(--radius-xl)] p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center shadow-[var(--shadow-xl)] border border-[var(--color-gray-700)] backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.8)', // Semi-transparent for subtle glassmorphism
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Unique Icon Header */}
        <div className="mx-auto font-logo text-text-primary text-3xl mb-4 w-16 h-16 rounded-[var(--radius-full)] flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)/10' }}>
          Cartify
        </div>

        <h3 
          className="text-2xl sm:text-xl font-black mb-2 leading-tight"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-white)'
          }}
        >
          Reset Password
        </h3>
        <p 
          className="text-base sm:text-lg mb-6 leading-relaxed"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)'
          }}
        >
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
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
              placeholder="your@email.com"
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

          {/* BUTTONS */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--transition-normal)] disabled:opacity-70 disabled:cursor-not-allowed ${loading ? '' : 'hover:scale-105'}`}
              style={{
                background: 'var(--gradient-orange)',
                color: 'var(--color-white)',
                border: 'none',
                boxShadow: 'var(--shadow-orange)'
              }}
            >
              {loading ? "Please wait..." : "Send Link to reset Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--transition-normal)]"
              style={{
                border: '1px solid var(--color-gray-600)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-700)';
                e.currentTarget.style.color = 'var(--color-white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
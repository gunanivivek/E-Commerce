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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h3 className="text-3xl font-semibold text-primary-400 text-start mb-2">
          Reset Password
        </h3>
        <p className="text-start text-primary-400 mb-6">
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-lg text-primary-400 font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-background focus:border focus:border-primary-400 rounded p-2.5"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-200 text-white py-2 rounded hover:cursor-pointer hover:bg-primary-400 transition"
            >
              {loading ? "Please wait..." : "Send Link to reset Password"}
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

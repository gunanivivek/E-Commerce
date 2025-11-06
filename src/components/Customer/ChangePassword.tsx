import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useChangePassword } from "../../hooks/useChangePassword";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const changePasswordMutation = useChangePassword();
  const newPassword = watch("newPassword");

  const onSubmit = (data: FormData) => {
    // keep same logic: check match first
    if (data.newPassword !== data.confirmPassword) {
      toast.error("❌ New password and confirm password do not match");
      return;
    }

    changePasswordMutation.mutate(
      {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      },
      {
        onSuccess: (res: { message?: string }) => {
          // identical behavior to your original: dismiss loading, toast, reset form
          toast.success(res?.message || "✅ Password changed successfully!");
          reset();
        },
        onError: (err: Error) => {
          toast.error(err?.message || "❌ Failed to change password");
        },
      }
    );
  };

  return (
    <section className="bg-[var(--color-background)] py-5 px-6 md:px-6">
      <div className=" rounded-lg ">
        <h2 className="text-3xl font-bold mb-6 leading-tight text-[var(--color-primary-400)]">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter your current password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="px-6 py-3 font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed w-full"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "black",
            }}
          >
            {changePasswordMutation.isPending ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
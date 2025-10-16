import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(
      { ...data},
      {
        onSuccess: () => {
          reset();
          navigate("/"); //Will be adding role based navigation to this.
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 md:px-8">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary-400">
          Merchant Hub
        </h2>
        <p className="text-primary-400 mb-6 text-base sm:text-lg mt-1">
          Manage your store with ease
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder={`adam@example.com`}
              {...register("email", { required: true })}
              className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a7bfa5]"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
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
            className="w-full bg-primary-300 hover:bg-[#95b494] text-white font-medium py-2 rounded-lg transition"
          >
            Sign In 
          </button>

          {loginMutation.isError && (
            <p className="text-red-500 mt-2">
              {(loginMutation.error as Error).message}
            </p>
          )}
        </form>

        <p className="text-base sm:text-lg text-gray-600 mt-4">
          New here?{" "}
          <button
            onClick={()=> navigate("/signup")}
            className="text-primary-300 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

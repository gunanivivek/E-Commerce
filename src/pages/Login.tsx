import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { useNavigate, useLocation } from "react-router";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        reset();
        // if a `from` location was provided (redirected to login), go back there
        const state = (location as unknown as { state?: { from?: string } })?.state;
        const returnTo = state?.from;
        if (returnTo && typeof returnTo === "string") {
          navigate(returnTo, { replace: true });
          return;
        }

        const role = res.user.role;

        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "seller":
            navigate("/seller");
            break;
          case "customer":
            navigate("/");
            break;
          default:
            navigate("/");
        }
      },
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-background text-primary">
        <div
          className="
            relative rounded-xl
            p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center
            shadow-xl border border-[var(--color-border)]
            bg-background backdrop-blur-sm
          "
        >
          {/* Logo Header */}
          <div
            className="
              mx-auto font-logo font-stretch-expanded text-5xl mb-1 
               flex items-center justify-center
               text-accent-darker
            "
          >
            Cartify
          </div>

          <p className="text-base sm:text-lg mb-6 leading-relaxed text-[var(--color-text-secondary)] font-body">
            Manage your store with ease
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-1 font-medium text-text-primary font-body"
              >
                Email*
              </label>
              <input
                id="email"
                type="email"
                placeholder="adam@example.com"
                {...register("email", { required: true })}
                className="
                  w-full rounded-[var(--radius-md)] px-3 py-3
                  bg-[var(--color-surface-light)]
                  border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-gray-500)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
                  transition-all duration-[var(--transition-fast)]
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-1 font-medium text-text-primary font-body"
              >
                Password*
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
                className="
                  w-full rounded-[var(--radius-md)] px-3 py-3
                  bg-[var(--color-surface-light)]
                  border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-gray-500)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
                  transition-all duration-[var(--transition-fast)]
                "
              />
            </div>

            <p className="text-sm sm:text-base mt-4 text-right">
              <button
              type="button"
                onClick={() => navigate("/forgotPassword")}
                className="
                  hover:underline hover:cursor-pointer transition-colors duration-[var(--transition-fast)]
                  font-medium text-text-secondary
                "
              >
                Forgot Password?
              </button>
            </p>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`
                w-full py-3 rounded-lg font-bold text-lg
                transition-all duration-[var(--transition-normal)]
                bg-accent-dark text-primary-100
                hover:bg-accent-light hover:cursor-pointer border-primary-border border-2
                hover:scale-102 disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {loginMutation.isPending ? "Logging in..." : "Sign In"}
            </button>

            
          </form>

          <p className="text-base sm:text-lg leading-relaxed mt-4 text-text-secondary font-body">
            New here?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="
                hover:underline hover:cursor-pointer transition-colors duration-[var(--transition-fast)]
                font-medium text-[var(--color-accent-dark)]
              "
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

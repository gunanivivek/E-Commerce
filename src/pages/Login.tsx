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
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        reset(); // reset form

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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden">
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

       
        <p 
          className="text-base sm:text-lg mb-6 leading-relaxed"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)'
          }}
        >
          Manage your store with ease
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
              placeholder="adam@example.com"
              {...register("email", { required: true })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-gray-600)',
                color: 'var(--color-white)'
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              className="block text-sm mb-1 font-medium"
              style={{ 
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
              className="w-full rounded-[var(--radius-md)] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-gray-500)]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-gray-600)',
                color: 'var(--color-white)'
              }}
            />
          </div>

          <p className="text-sm sm:text-base mt-4 text-right">
            <a
              href="/forgotPassword"
              className="hover:underline transition-colors duration-[var(--transition-fast)] font-medium"
              style={{ 
                color: 'var(--color-accent)'
              }}
            >
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-3 rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--transition-normal)] disabled:opacity-70 disabled:cursor-not-allowed ${loginMutation.isPending ? '' : 'hover:scale-105'}`}
            style={{
              background: 'var(--gradient-orange)',
              color: 'var(--color-white)',
              border: 'none',
              boxShadow: 'var(--shadow-orange)'
            }}
          >
            {loginMutation.isPending ? "Logging in..." : "Sign In"}
          </button>

          {loginMutation.isError && (
            <p 
              className="text-sm mt-2 text-center"
              style={{ 
                color: 'var(--color-error)',
                fontFamily: 'var(--font-body)'
              }}
            >
              {(loginMutation.error as Error).message}
            </p>
          )}
        </form>

        <p 
          className="text-base sm:text-lg leading-relaxed mt-4"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)'
          }}
        >
          New here?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="hover:underline transition-colors duration-[var(--transition-fast)] font-medium"
            style={{ 
              color: 'var(--color-accent)'
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
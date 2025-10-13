import { useNavigate } from "react-router";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-300/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-primary-300" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground text-primary-400">401</h1>
          <p className="text-2xl font-semibold text-foreground text-primary-400">
            Unauthorized Access
          </p>
          <p className="text-muted-foreground">
            You don’t have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            className="text-white bg-primary-400 hover:bg-primary-300 px-8 py-2 rounded-xl"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

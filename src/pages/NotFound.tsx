import { useNavigate } from "react-router";
import { FileQuestionMark } from "lucide-react";

const NotFound = () => {

    const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-300/20 flex items-center justify-center">
            <FileQuestionMark  className="w-10 h-10 text-primary-300" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground text-primary-400">404</h1>
          <p className="text-2xl font-semibold text-foreground text-primary-400">Page Not Found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="text-white bg-primary-400 hover:bg-primary-300 px-8 py-2 rounded-xl" onClick={() => navigate(-1)} >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
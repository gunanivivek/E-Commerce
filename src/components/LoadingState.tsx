import React from "react";
import { Package } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-primary-400/10">
        <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center flex-shrink-0 animate-pulse">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div className="text-primary-400 min-w-0">
          <h1 className="font-bold text-lg text-sidebar-foreground truncate">
            Cartify
          </h1>
          <p className="text-xs font-semibold text-muted-foreground truncate">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;

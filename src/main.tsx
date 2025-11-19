import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      
    },
  },
});


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="bottom-right"
          autoClose={2800}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover={true}
          draggable={false}
          theme="light"
          toastStyle={{
            background: "var(--color-surface-light)",
            color: "var(--color-text-primary)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            fontSize: "0.9rem",
            fontFamily: "var(--font-body)",
            boxShadow: "var(--shadow-accent)",
            padding: "14px 18px",
          }}
        />
        <App />
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);

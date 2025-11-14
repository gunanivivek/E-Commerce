import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as productsApi from "./api/productsApi";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // keep data fresh for 5 minutes to avoid refetching on every navigation
      staleTime: 1000 * 60 * 30,
      // avoid refetches on window focus / mount / reconnect unless stale
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

// prefetch products at app startup to reduce perceived load when navigating to products page
queryClient
  .prefetchQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getProducts(),
  })
  .catch(() => {
    // ignore prefetch errors silently; Products page will handle fetch errors itself
  });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <ScrollToTop />
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);

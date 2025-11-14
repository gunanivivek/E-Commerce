import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as productsApi from "./api/productsApi";
import { ToastContainer } from "react-toastify";

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
    // Provide a safe default for mutations so internals don't need to call
    // a missing `defaultMutationOptions` helper on the client.
    mutations: {
      // no-op defaults; callers can still override per-mutation
    },
  },
});

// Compatibility shim: ensure QueryClient exposes a defaultMutationOptions function
// Some versions/patches of @tanstack/react-query expect this to be callable from
// MutationObserver. If it's missing (or not a function), provide a noop merger.
type QCWithDefaultMutation = {
  defaultMutationOptions?: (opts?: unknown) => unknown;
};

const qcWithDefaultMutation = queryClient as unknown as QCWithDefaultMutation;

if (typeof qcWithDefaultMutation.defaultMutationOptions !== "function") {
  qcWithDefaultMutation.defaultMutationOptions = (opts?: unknown) => opts ?? {};
}

// Also ensure the QueryClient prototype exposes the method for any internals
// that check the prototype rather than the instance.
try {
  const QCP = (QueryClient as unknown) as { prototype?: Record<string, unknown> };
  if (QCP?.prototype) {
    const proto = QCP.prototype as { defaultMutationOptions?: (opts?: unknown) => unknown };
    if (typeof proto.defaultMutationOptions !== "function") {
      proto.defaultMutationOptions = (opts?: unknown) => opts ?? {};
    }
  }
} catch (err) {
  // best-effort shim; log if something unexpected happens
  console.warn("QueryClient prototype shim failed:", err);
}

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

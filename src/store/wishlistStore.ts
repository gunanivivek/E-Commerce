// wishlistStore.ts
// Manages wishlist state (guest in-memory + authenticated server-backed).
// - Guest: in-memory additions/removals (no localStorage).
// - Authenticated: optimistic UI, then server sync via wishlistApi.
// - BroadcastChannel used to sync wishlist across tabs for the same user.

import { create } from "zustand";
import * as wishlistApi from "../api/wishlistApi";
import { toast } from "react-toastify";
import { useAuthStore } from "./authStore";
import type { WishlistItemOut, WishlistOut } from "../types/wishlist";
import type { Product } from "./useProductStore";

// BroadcastChannel setup for cross-tab sync
const instanceId =
  typeof window !== "undefined" ? Math.random().toString(36).slice(2) : "server";
const channel: BroadcastChannel | null =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("ecom_wishlist_channel")
    : null;

let postWishlistState:
  | ((payload: { wishlistItems: unknown[] }) => void)
  | undefined;

// Map server response shape to local Product shape used in UI
const mapWishlistOutToState = (wishlist: WishlistOut): Product[] =>
  wishlist.items.map((i: WishlistItemOut) => ({
    id: i.product_id,
    name: i.name,
    description: "",
    price: i.price ?? 0,
    discount_price: null,
    stock: 0,
    images: i.image_url ? [i.image_url] : [],
    slug: "",
    image: i.image_url ?? "",
    is_active: true,
    created_at: new Date().toISOString(),
    rating: 0,
  } as Product));

// Store interface
interface WishlistState {
  wishlistItems: Product[];
  fetchWishlist: () => Promise<void>;
  addItem: (item: { id: number }) => Promise<void>; // accepts { id }
  addToWishlist: (product: Product) => Promise<void>; // accepts full product (compat)
  removeItem: (id: number) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>; // compat wrapper
  clearWishlist: () => Promise<void>;
}

// Create wishlist store
export const useWishlistStore = create<WishlistState>((set) => {
  const initial: Product[] = [];

  const wishstore: WishlistState = {
    wishlistItems: initial,

    // Fetch wishlist from server when authenticated
    fetchWishlist: async () => {
      try {
        const user = useAuthStore.getState().user;
        if (!user || user.role !== "customer") return; 
        const data = await wishlistApi.getWishlist();
        const mapped = mapWishlistOutToState(data);
        set({ wishlistItems: mapped });
        postWishlistState?.({ wishlistItems: mapped });
      } catch (err) {
        console.error("fetchWishlist error:", err);
      }
    },

    // Add by id (minimal payload). Supports guest (in-memory) + authenticated server flow.
    addItem: async (item) => {
      try {
        const user = useAuthStore.getState().user;
        const prev = useWishlistStore.getState().wishlistItems;

        // Guest flow: keep in-memory only
        if (!user || user.role !== "customer") {
          const exists = prev.find((i) => i.id === item.id);
          if (exists) {
            toast.info("Already in your wishlist");
            return;
          }
          const guestProduct: Product = {
            id: item.id,
            name: "",
            description: "",
            price: 0,
            discount_price: null,
            stock: 0,
            images: [],
            slug: "",
            image: "",
            is_active: true,
            created_at: new Date().toISOString(),
            rating: 0,
          };
          const next = [...prev, guestProduct];
          set({ wishlistItems: next });
          postWishlistState?.({ wishlistItems: next });
          toast.success("Added to wishlist");
          return;
        }

        // Authenticated: optimistic update then server sync
        const already = prev.some((p) => p.id === item.id);
        if (already) {
          toast.info("Already in your wishlist");
          return;
        }
        const optimisticProduct: Product = {
          id: item.id,
          name: "",
          description: "",
          price: 0,
          discount_price: null,
          stock: 0,
          images: [],
          slug: "",
          image: "",
          is_active: true,
          created_at: new Date().toISOString(),
          rating: 0,
        };
        const optimistic = [...prev, optimisticProduct];
        set({ wishlistItems: optimistic });
        postWishlistState?.({ wishlistItems: optimistic });

        const payload = { product_id: item.id };
        const res = await wishlistApi.addToWishlist(payload);
        const mapped = mapWishlistOutToState(res);
        set({ wishlistItems: mapped });
        postWishlistState?.({ wishlistItems: mapped });
        toast.success("Added to wishlist");
      } catch (err) {
        console.error("addItem error:", err);
      }
    },

    // Backwards-compatible API used by components: accept full Product
    addToWishlist: async (product) => {
      try {
        console.debug("wishlist.addToWishlist called for product id=", product?.id);
        const user = useAuthStore.getState().user;
        const prev = useWishlistStore.getState().wishlistItems;

        if (prev.some((p) => p.id === product.id)) {
          toast.info("Already in your wishlist");
          return;
        }

        // Guest flow: in-memory add
        if (!user || user.role !== "customer") {
          const next = [...prev, product];
          set({ wishlistItems: next });
          postWishlistState?.({ wishlistItems: next });
          toast.success("Added to wishlist");
          return;
        }

        // Authenticated: optimistic update + server sync
        const optimistic = [...prev, product];
        set({ wishlistItems: optimistic });
        postWishlistState?.({ wishlistItems: optimistic });

        const payload = { product_id: product.id };
        const res = await wishlistApi.addToWishlist(payload);
        const mapped = mapWishlistOutToState(res);
        set({ wishlistItems: mapped });
        postWishlistState?.({ wishlistItems: mapped });
        toast.success("Added to wishlist");
      } catch (err) {
        console.error("addToWishlist error:", err);
      }
    },

    // Remove item by id (guest in-memory + server-backed)
    removeItem: async (id) => {
      try {
        const user = useAuthStore.getState().user;
        const prev = useWishlistStore.getState().wishlistItems;

        // Guest: in-memory removal
        if (!user || user.role !== "customer") {
          const next = prev.filter((i) => i.id !== id);
          set({ wishlistItems: next });
          postWishlistState?.({ wishlistItems: next });
          toast.info("Removed from wishlist");
          return;
        }

        // Server: call API and set returned state
        const res = await wishlistApi.removeFromWishlist(id);
        const mapped = mapWishlistOutToState(res);
        set({ wishlistItems: mapped });
        postWishlistState?.({ wishlistItems: mapped });
        toast.info("Removed from wishlist");
      } catch (err) {
        console.error("removeItem error:", err);
      }
    },

    // compatibility wrapper (keeps old API names working)
    removeFromWishlist: async (id) => {
      try {
        await wishstore.removeItem(id);
      } catch (err) {
        console.error("removeFromWishlist error:", err);
      }
    },

    // Clear wishlist (guest in-memory or server)
    clearWishlist: async () => {
      try {
        const user = useAuthStore.getState().user;
        if (!user || user.role !== "customer") {
          set({ wishlistItems: [] });
          return;
        }
        const res = await wishlistApi.clearWishlist();
        const mapped = mapWishlistOutToState(res);
        set({ wishlistItems: mapped });
        postWishlistState?.({ wishlistItems: mapped });
        toast.info("Wishlist cleared");
      } catch (err) {
        console.error("clearWishlist error:", err);
      }
    },
  };

  // local `store` reference so compatibility wrapper can call removeItem etc.
  const store: WishlistState = wishstore; // explicit type to avoid `any`

  return store;
});

// Auth subscription: fetch server wishlist on login, clear on logout
try {
  useAuthStore.subscribe((authState) => {
    const user = authState.user;
    if (user) {
      useWishlistStore.getState().fetchWishlist();
    } else {
      useWishlistStore.setState({ wishlistItems: [] });
    }
  });
} catch (err) {
  console.error("auth subscribe failed:", err);
}

// BroadcastChannel sync: post and listen for wishlist updates across tabs
try {
  if (channel) {
    postWishlistState = (payload) => {
      try {
        channel.postMessage({
          type: "wishlist_update",
          source: instanceId,
          userId: useAuthStore.getState().user?.id ?? null,
          payload,
        });
      } catch {
        /* ignore */
      }
    };

    channel.onmessage = (ev) => {
      try {
        const msg = ev.data;
        if (!msg || msg.source === instanceId) return;
        const msgUser = msg.userId ?? null;
        const currentUser = useAuthStore.getState().user?.id ?? null;
        if (msgUser !== currentUser) return;
        const p = msg.payload;
        if (!p) return;
        useWishlistStore.setState({ wishlistItems: p.wishlistItems ?? [] });
      } catch {
        /* ignore */
      }
    };
  }
} catch {
  /* ignore */
}

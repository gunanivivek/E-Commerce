import { create } from "zustand";
import * as cartApi from "../api/cartApi";
import { useAuthStore } from "./authStore";
import type { CartItemOut, CartOut } from "../types/cart";

// Migration: clear any legacy persisted guest cart left in localStorage.
// Historically we used the key "cart_items" to persist guest carts; the
// new approach intentionally does not persist cart to localStorage. Remove
// the legacy key (safe no-op if not present).
try {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem("cart_items");
    } catch {
      // ignore storage exceptions (e.g., quota, privacy mode)
    }
  }
} catch {
  // ignore in non-browser environments
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface CartState {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (item: { id: number; quantity?: number }) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string | null;
  applyCoupon: (code: string) => Promise<void>;
}

const mapCartOutToState = (cart: CartOut): CartItem[] => {
  return cart.items.map((i: CartItemOut) => ({
    id: i.product_id,
    name: i.name,
    price: i.unit_price,
    quantity: i.quantity,
    image: i.image_url ?? undefined,
  }));
};

export const useCartStore = create<CartState>((set) => {
  // start with empty in-memory cart; do not persist to localStorage anymore
  const initial: CartItem[] = [];

  const store: CartState = {
    cartItems: initial,
    subtotal: 0,
    discount: 0,
    total: 0,
    coupon: null,

    fetchCart: async () => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // not authenticated; no server cart available - keep current in-memory cart
          return;
        }
  const data = await cartApi.getCart();
  const mapped = mapCartOutToState(data);
  set({ cartItems: mapped, subtotal: data.subtotal ?? 0, discount: data.discount ?? 0, total: data.total ?? 0, coupon: data.coupon ?? null });
      } catch (err) {
        console.error("fetchCart error:", err);
      }
    },

    addItem: async (item) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: update in-memory cart only (no local persistence)
          set((state) => {
            const existing = state.cartItems.find((i) => i.id === item.id);
            let next: CartItem[];
            if (existing) {
              next = state.cartItems.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
              );
            } else {
              next = [...state.cartItems, { id: item.id, name: "", price: 0, quantity: item.quantity ?? 1 }];
            }
            return { cartItems: next };
          });
          return;
        }

        // authenticated: perform optimistic update so UI reflects immediately
        const prev = useCartStore.getState().cartItems;
        const existing = prev.find((i) => i.id === item.id);
        let optimistic: CartItem[];
        if (existing) {
          optimistic = prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          );
        } else {
          optimistic = [...prev, { id: item.id, name: "", price: 0, quantity: item.quantity ?? 1 }];
        }

        // apply optimistic state
        set({ cartItems: optimistic });

        // sync with server
        const payload = { product_id: item.id, quantity: item.quantity ?? 1 };
        cartApi
          .addToCart(payload)
          .then((res) => {
            const cartRes = res as CartOut;
            const mapped = mapCartOutToState(cartRes);
            set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
          })
          .catch((err) => {
            console.error("addToCart API error:", err);
            // revert optimistic state on failure
            set({ cartItems: prev });
          });
      } catch (err) {
        console.error("addItem error:", err);
      }
    },

    removeItem: async (id) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: remove from in-memory cart only
          set((state) => ({ cartItems: state.cartItems.filter((item) => item.id !== id) }));
          return;
        }
  const res = await cartApi.removeFromCart(id);
  const cartRes = res as CartOut;
  const mapped = mapCartOutToState(cartRes);
  set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
        // server result applied above
      } catch (err) {
        console.error("removeItem error:", err);
      }
    },

    updateQuantity: async (id, delta) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: update in-memory cart only
          set((state) => {
            const current = state.cartItems.find((c) => c.id === id);
            const newQty = current ? Math.max(1, current.quantity + delta) : Math.max(1, 1 + delta);
            const next = state.cartItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item));
            return { cartItems: next };
          });
          return;
        }

        // server-side: optimistic update then persist when API returns
        set((state) => {
          const current = state.cartItems.find((c) => c.id === id);
          const newQty = current ? Math.max(1, current.quantity + delta) : Math.max(1, 1 + delta);
          cartApi.updateCart({ product_id: id, quantity: newQty })
            .then((res) => {
              try {
                const cartRes = res as CartOut;
                const mapped = mapCartOutToState(cartRes);
                set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
              } catch (e) {
                console.error("failed to apply updateCart response:", e);
              }
            })
            .catch((err) => console.error("updateCart API error:", err));
          return {
            cartItems: state.cartItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)),
          };
        });
      } catch (err) {
        console.error("updateQuantity error:", err);
      }
    },

    clearCart: async () => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: clear in-memory cart only
          set({ cartItems: [] });
          return;
        }
        const res = await cartApi.clearCart();
        const mapped = mapCartOutToState(res);
        set({ cartItems: mapped, subtotal: res.subtotal ?? 0, discount: res.discount ?? 0, total: res.total ?? 0, coupon: res.coupon ?? null });
      } catch (err) {
        console.error("clearCart error:", err);
      }
    },

    applyCoupon: async (code: string) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // require login to apply coupon (server-side coupons require auth)
          throw new Error("Login required to apply coupon");
        }
        const res = await cartApi.applyCoupon(code);
        const cartRes = res as CartOut;
        const mapped = mapCartOutToState(cartRes);
        set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
      } catch (err) {
        console.error("applyCoupon error:", err);
        throw err;
      }
    },
  };

  // NOTE: subscriptions moved outside of the create factory to avoid TDZ

  return store;
});

// subscribe to auth changes: when a user logs in, fetch their server-side cart
try {
  useAuthStore.subscribe((authState) => {
    const user = authState.user;
    if (user) {
      (async () => {
        try {
          const server = await cartApi.getCart();
          useCartStore.setState({ cartItems: mapCartOutToState(server), subtotal: server.subtotal ?? 0, discount: server.discount ?? 0, total: server.total ?? 0, coupon: server.coupon ?? null });
        } catch (e) {
          console.error("fetchCart on login failed:", e);
        }
      })();
    } else {
      // user logged out: clear in-memory cart
      useCartStore.setState({ cartItems: [], subtotal: 0, discount: 0, total: 0, coupon: null });
    }
  });
} catch (err) {
  console.error("auth subscribe setup failed:", err);
}

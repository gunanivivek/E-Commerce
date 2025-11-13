import { create } from "zustand";
import * as cartApi from "../api/cartApi";
import { toast } from "react-toastify";
import { useAuthStore } from "./authStore";
import type { CartItemOut, CartOut } from "../types/cart";

// BroadcastChannel-based cross-tab sync (no localStorage)
const instanceId =
  typeof window !== "undefined"
    ? Math.random().toString(36).slice(2)
    : "server";
const channel: BroadcastChannel | null =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("ecom_cart_channel")
    : null;

// Helper forward declaration — assigned after CartItem type is declared
let postCartState:
  | ((payload: {
      cartItems: unknown[];
      subtotal: number;
      discount: number;
      total: number;
      coupon: string | null;
    }) => void)
  | undefined;

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
        set({
          cartItems: mapped,
          subtotal: data.subtotal ?? 0,
          discount: data.discount ?? 0,
          total: data.total ?? 0,
          coupon: data.coupon ?? null,
        });
        try {
          postCartState?.({
            cartItems: mapped,
            subtotal: data.subtotal ?? 0,
            discount: data.discount ?? 0,
            total: data.total ?? 0,
            coupon: data.coupon ?? null,
          });
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error("fetchCart error:", err);
      }
    },

    addItem: async (item) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: update in-memory cart only (no local persistence)
          const prevState = useCartStore.getState().cartItems ?? [];
          const existing = prevState.find((i) => i.id === item.id);
          let next: CartItem[];
          if (existing) {
            next = prevState.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            );
          } else {
            next = [
              ...prevState,
              { id: item.id, name: "", price: 0, quantity: item.quantity ?? 1 },
            ];
          }
          set({ cartItems: next });
          try {
            postCartState?.({
              cartItems: next,
              subtotal: 0,
              discount: 0,
              total: 0,
              coupon: null,
            });
          } catch {
            /* ignore */
          }
          return;
        }

        // authenticated: perform optimistic update so UI reflects immediately
        const prev = useCartStore.getState().cartItems;
        const existing = prev.find((i) => i.id === item.id);
        let optimistic: CartItem[];
        if (existing) {
          optimistic = prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i
          );
        } else {
          optimistic = [
            ...prev,
            { id: item.id, name: "", price: 0, quantity: item.quantity ?? 1 },
          ];
        }

        // apply optimistic state
        set({ cartItems: optimistic });
        try {
          postCartState?.({
            cartItems: optimistic,
            subtotal: 0,
            discount: 0,
            total: 0,
            coupon: null,
          });
        } catch {
          /* ignore */
        }

        // sync with server
        const payload = { product_id: item.id, quantity: item.quantity ?? 1 };
        cartApi
          .addToCart(payload)
          .then((res) => {
            const cartRes = res as CartOut;
            const mapped = mapCartOutToState(cartRes);
            set({
              cartItems: mapped,
              subtotal: cartRes.subtotal ?? 0,
              discount: cartRes.discount ?? 0,
              total: cartRes.total ?? 0,
              coupon: cartRes.coupon ?? null,
            });
            try {
              postCartState?.({
                cartItems: mapped,
                subtotal: cartRes.subtotal ?? 0,
                discount: cartRes.discount ?? 0,
                total: cartRes.total ?? 0,
                coupon: cartRes.coupon ?? null,
              });
            } catch {
              /* ignore */
            }
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
          const prevState = useCartStore.getState().cartItems ?? [];
          const next = prevState.filter((item) => item.id !== id);
          set({ cartItems: next });
          try {
            postCartState?.({
              cartItems: next,
              subtotal: 0,
              discount: 0,
              total: 0,
              coupon: null,
            });
          } catch {
            /* ignore */
          }
          return;
        }
        const res = await cartApi.removeFromCart(id);
        const cartRes = res as CartOut;
        const mapped = mapCartOutToState(cartRes);
        set({
          cartItems: mapped,
          subtotal: cartRes.subtotal ?? 0,
          discount: cartRes.discount ?? 0,
          total: cartRes.total ?? 0,
          coupon: cartRes.coupon ?? null,
        });
        try {
          postCartState?.({
            cartItems: mapped,
            subtotal: cartRes.subtotal ?? 0,
            discount: cartRes.discount ?? 0,
            total: cartRes.total ?? 0,
            coupon: cartRes.coupon ?? null,
          });
        } catch {
          /* ignore */
        }
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
          const current = useCartStore
            .getState()
            .cartItems.find((c) => c.id === id);
          const newQty = current
            ? Math.max(1, current.quantity + delta)
            : Math.max(1, 1 + delta);
          const next = useCartStore
            .getState()
            .cartItems.map((item) =>
              item.id === id ? { ...item, quantity: newQty } : item
            );
          set({ cartItems: next });
          try {
            postCartState?.({
              cartItems: next,
              subtotal: 0,
              discount: 0,
              total: 0,
              coupon: null,
            });
          } catch {
            /* ignore */
          }
          return;
        }

        // server-side: optimistic update then persist when API returns
        try {
          const current = useCartStore
            .getState()
            .cartItems.find((c) => c.id === id);
          const newQty = current
            ? Math.max(1, current.quantity + delta)
            : Math.max(1, 1 + delta);
          const optimisticNext = useCartStore
            .getState()
            .cartItems.map((item) =>
              item.id === id ? { ...item, quantity: newQty } : item
            );
          set({ cartItems: optimisticNext });
          try {
            postCartState?.({
              cartItems: optimisticNext,
              subtotal: 0,
              discount: 0,
              total: 0,
              coupon: null,
            });
          } catch {
            /* ignore */
          }
          cartApi
            .updateCart({ product_id: id, quantity: newQty })
            .then((res) => {
              try {
                const cartRes = res as CartOut;
                const mapped = mapCartOutToState(cartRes);
                set({
                  cartItems: mapped,
                  subtotal: cartRes.subtotal ?? 0,
                  discount: cartRes.discount ?? 0,
                  total: cartRes.total ?? 0,
                  coupon: cartRes.coupon ?? null,
                });
                try {
                  postCartState?.({
                    cartItems: mapped,
                    subtotal: cartRes.subtotal ?? 0,
                    discount: cartRes.discount ?? 0,
                    total: cartRes.total ?? 0,
                    coupon: cartRes.coupon ?? null,
                  });
                } catch {
                  /* ignore */
                }
              } catch (e) {
                console.error("failed to apply updateCart response:", e);
              }
            })
            .catch((err) => console.error("updateCart API error:", err));
        } catch (err) {
          console.error("updateQuantity error:", err);
        }
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
        set({
          cartItems: mapped,
          subtotal: res.subtotal ?? 0,
          discount: res.discount ?? 0,
          total: res.total ?? 0,
          coupon: res.coupon ?? null,
        });
        try {
          postCartState?.({
            cartItems: mapped,
            subtotal: res.subtotal ?? 0,
            discount: res.discount ?? 0,
            total: res.total ?? 0,
            coupon: res.coupon ?? null,
          });
        } catch {
          /* ignore */
        }
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
        set({
          cartItems: mapped,
          subtotal: cartRes.subtotal ?? 0,
          discount: cartRes.discount ?? 0,
          total: cartRes.total ?? 0,
          coupon: cartRes.coupon ?? null,
        });
        try {
          postCartState?.({
            cartItems: mapped,
            subtotal: cartRes.subtotal ?? 0,
            discount: cartRes.discount ?? 0,
            total: cartRes.total ?? 0,
            coupon: cartRes.coupon ?? null,
          });
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error("applyCoupon error:", err);
        throw err;
      }
    },
  };
  return store;
});

// subscribe to auth changes: when a user logs in, fetch their server-side cart
try {
  useAuthStore.subscribe((authState) => {
    const user = authState.user;
    if (user) {
      // user logged in: if we have any guest in-memory items, push them to server then refresh from server
      (async () => {
        try {
          const guestItems = useCartStore.getState().cartItems ?? [];
          let mergedCount = 0;
          if (guestItems && guestItems.length) {
            // Sequentially add guest items to server to avoid race conditions and to let server apply its own rules
            for (const it of guestItems) {
              try {
                await cartApi.addToCart({
                  product_id: it.id,
                  quantity: it.quantity,
                });
                mergedCount += 1;
              } catch (e) {
                // log and continue with next item
                console.error("sync guest cart item failed:", e);
              }
            }
          }

          // Refresh canonical server cart and set state
          try {
            const server = await cartApi.getCart();
            const mappedServer = mapCartOutToState(server);
            useCartStore.setState({
              cartItems: mappedServer,
              subtotal: server.subtotal ?? 0,
              discount: server.discount ?? 0,
              total: server.total ?? 0,
              coupon: server.coupon ?? null,
            });
            try {
              postCartState?.({
                cartItems: mappedServer,
                subtotal: server.subtotal ?? 0,
                discount: server.discount ?? 0,
                total: server.total ?? 0,
                coupon: server.coupon ?? null,
              });
            } catch {
              /* ignore */
            }
            if (mergedCount > 0) {
              try {
                toast.success(
                  `Merged ${mergedCount} item${
                    mergedCount > 1 ? "s" : ""
                  } into your cart`
                );
              } catch {
                // ignore toast errors
              }
            }
          } catch (e) {
            console.error("fetchCart after sync failed:", e);
          }
        } catch (err) {
          console.error("auth subscribe handler error:", err);
        }
      })();
    } else {
      // user logged out: clear in-memory cart
      useCartStore.setState({
        cartItems: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        coupon: null,
      });
    }
  });
} catch (err) {
  console.error("auth subscribe setup failed:", err);
}

// If the auth store already has a user (e.g., restored from localStorage) then
// run the same sync logic once on initialization. Subscriptions only fire on
// changes, so a pre-existing user won't trigger the subscribe callback.
try {
  const existingUser = useAuthStore.getState().user;
  if (existingUser) {
    (async () => {
      try {
        const guestItems = useCartStore.getState().cartItems ?? [];
        let mergedCount = 0;
        if (guestItems && guestItems.length) {
          for (const it of guestItems) {
            try {
              await cartApi.addToCart({
                product_id: it.id,
                quantity: it.quantity,
              });
              mergedCount += 1;
            } catch (e) {
              console.error("initial sync guest cart item failed:", e);
            }
          }
        }

        const server = await cartApi.getCart();
        const mappedServer = mapCartOutToState(server);
        useCartStore.setState({
          cartItems: mappedServer,
          subtotal: server.subtotal ?? 0,
          discount: server.discount ?? 0,
          total: server.total ?? 0,
          coupon: server.coupon ?? null,
        });
        try {
          postCartState?.({
            cartItems: mappedServer,
            subtotal: server.subtotal ?? 0,
            discount: server.discount ?? 0,
            total: server.total ?? 0,
            coupon: server.coupon ?? null,
          });
        } catch {
          /* ignore */
        }
        if (mergedCount > 0) {
          try {
            toast.success(
              `Merged ${mergedCount} item${
                mergedCount > 1 ? "s" : ""
              } into your cart`
            );
          } catch {
            // ignore toast issues
          }
        }
      } catch (e) {
        console.error("initial auth sync failed:", e);
      }
    })();
  }
} catch {
  /* ignore */
}

// Setup BroadcastChannel poster and listener after the store is created.
try {
  if (channel) {
    postCartState = (payload) => {
      try {
        channel.postMessage({
          type: "cart_update",
          source: instanceId,
          userId: useAuthStore.getState().user?.id ?? null,
          payload,
        });
      } catch {
        // ignore
      }
    };

    channel.onmessage = (ev) => {
      try {
        const msg = ev.data;
        if (!msg) return;
        if (msg.source === instanceId) return; // ignore our own messages
        const msgUser = msg.userId ?? null;
        const currentUser = useAuthStore.getState().user?.id ?? null;
        // Only apply messages meant for the same user (or both null for guests)
        if (msgUser !== currentUser) return;
        const p = msg.payload;
        if (!p) return;
        // apply incoming cart state
        useCartStore.setState({
          cartItems: p.cartItems ?? [],
          subtotal: p.subtotal ?? 0,
          discount: p.discount ?? 0,
          total: p.total ?? 0,
          coupon: p.coupon ?? null,
        });
      } catch {
        /* ignore */
      }
    };
  }
} catch {
  /* ignore */
}

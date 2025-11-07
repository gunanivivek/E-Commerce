import { create } from "zustand";
import * as cartApi from "../api/cartApi";
import { useAuthStore } from "./authStore";
import type { CartItemOut, CartOut } from "../types/cart";

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
  // coupon / discount
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
  const LOCAL_KEY = "cart_items";

  // load initial cart from localStorage (guest) as fallback
  let initial: CartItem[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      initial = JSON.parse(raw) as CartItem[];
    }
  } catch (err) {
    console.error("Failed to read cart from localStorage:", err);
  }

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
          // not authenticated; keep local cart
          return;
        }
  const data = await cartApi.getCart();
  const mapped = mapCartOutToState(data);
  set({ cartItems: mapped, subtotal: data.subtotal ?? 0, discount: data.discount ?? 0, total: data.total ?? 0, coupon: data.coupon ?? null });
        // persist server cart locally for quick hydration
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
        } catch (e) {
          console.error("persist cart to localStorage failed:", e);
        }
      } catch (err) {
        console.error("fetchCart error:", err);
      }
    },

    addItem: async (item) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: persist locally
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
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
            } catch (e) {
              console.error("persist cart to localStorage failed:", e);
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
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(optimistic));
        } catch (e) {
          console.error("persist cart to localStorage failed:", e);
        }

        // sync with server
        const payload = { product_id: item.id, quantity: item.quantity ?? 1 };
        cartApi
          .addToCart(payload)
          .then((res) => {
            const cartRes = res as CartOut;
            const mapped = mapCartOutToState(cartRes);
            set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
            } catch (e) {
              console.error("persist cart to localStorage failed:", e);
            }
          })
          .catch((err) => {
            console.error("addToCart API error:", err);
            // revert optimistic state on failure
            set({ cartItems: prev });
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(prev));
            } catch (e) {
              console.error("persist cart revert failed:", e);
            }
          });
      } catch (err) {
        console.error("addItem error:", err);
      }
    },

    removeItem: async (id) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: remove locally
          set((state) => {
            const next = state.cartItems.filter((item) => item.id !== id);
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
            } catch (e) {
              console.error("persist cart to localStorage failed:", e);
            }
            return { cartItems: next };
          });
          return;
        }
  const res = await cartApi.removeFromCart(id);
  const cartRes = res as CartOut;
  const mapped = mapCartOutToState(cartRes);
  set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
        } catch (e) {
          console.error("persist cart to localStorage failed:", e);
        }
      } catch (err) {
        console.error("removeItem error:", err);
      }
    },

    updateQuantity: async (id, delta) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) {
          // guest: update locally
          set((state) => {
            const current = state.cartItems.find((c) => c.id === id);
            const newQty = current ? Math.max(1, current.quantity + delta) : Math.max(1, 1 + delta);
            const next = state.cartItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item));
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
            } catch (e) {
              console.error("persist cart to localStorage failed:", e);
            }
            return { cartItems: next };
          });
          return;
        }

        // server-side: optimistic update then persist when API returns
        set((state) => {
          const current = state.cartItems.find((c) => c.id === id);
          const newQty = current ? Math.max(1, current.quantity + delta) : Math.max(1, 1 + delta);
          cartApi
            .updateCart({ product_id: id, quantity: newQty })
              .then((res) => {
              const cartRes = res as CartOut;
              const mapped = mapCartOutToState(cartRes);
              set({ cartItems: mapped, subtotal: cartRes.subtotal ?? 0, discount: cartRes.discount ?? 0, total: cartRes.total ?? 0, coupon: cartRes.coupon ?? null });
              try {
                localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
              } catch (e) {
                console.error("persist cart to localStorage failed:", e);
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
          set({ cartItems: [] });
          try {
            localStorage.removeItem(LOCAL_KEY);
          } catch (e) {
            console.error("remove local cart failed:", e);
          }
          return;
        }
        const res = await cartApi.clearCart();
        const mapped = mapCartOutToState(res);
        set({ cartItems: mapped, subtotal: res.subtotal ?? 0, discount: res.discount ?? 0, total: res.total ?? 0, coupon: res.coupon ?? null });
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
        } catch (e) {
          console.error("persist cart to localStorage failed:", e);
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

// subscribe to auth changes: on login, sync local guest cart to server
try {
  useAuthStore.subscribe((authState) => {
    const user = authState.user;
    if (user) {
      // user logged in: if we have local items, push them to server then fetch server cart
      try {
        const raw = localStorage.getItem("cart_items");
        if (raw) {
          const localItems: CartItem[] = JSON.parse(raw) as CartItem[];
          if (localItems && localItems.length) {
            // sequentially add items to server
            (async () => {
              for (const it of localItems) {
                try {
                  await cartApi.addToCart({ product_id: it.id, quantity: it.quantity });
                } catch (e) {
                  console.error("sync local cart item failed:", e);
                }
              }
              // refresh from server
              try {
                const server = await cartApi.getCart();
                const mapped = mapCartOutToState(server);
                useCartStore.setState({ cartItems: mapped });
                try {
                  localStorage.removeItem("cart_items");
                } catch (e) {
                  console.error("remove local cart failed:", e);
                }
              } catch (e) {
                console.error("fetchCart after sync failed:", e);
              }
            })();
          } else {
            // no local items: just fetch server cart
            (async () => {
              try {
                const server = await cartApi.getCart();
                useCartStore.setState({ cartItems: mapCartOutToState(server) });
              } catch (e) {
                console.error("fetchCart on login failed:", e);
              }
            })();
          }
        } else {
          // no local storage, just fetch
          (async () => {
            try {
              const server = await cartApi.getCart();
              useCartStore.setState({ cartItems: mapCartOutToState(server) });
            } catch (e) {
              console.error("fetchCart on login failed:", e);
            }
          })();
        }
      } catch (err) {
        console.error("auth subscribe handler error:", err);
      }
    }
  });
} catch (err) {
  console.error("auth subscribe setup failed:", err);
}

// persist any changes to localStorage
try {
  useCartStore.subscribe((state) => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(state.cartItems));
    } catch (e) {
      console.error("persist cart to localStorage failed:", e);
    }
  });
} catch (err) {
  console.error("cartStore subscribe failed:", err);
}

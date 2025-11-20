/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export interface RawNotification {
  id: number;
  type: string;
  order_id: number | null;
  payload: any;
  created_at: string;
  is_read: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const transformNotification = (raw: RawNotification): Notification => {
  let title = "";
  let message = "";

  if (raw.type === "new_order") {
    title = "New Order";
    message = `New order has been placed for you. Order #${raw.order_id} for amount ₹${raw.payload?.total_amount}.`;
  } else {
    title = raw.type;
    message = raw.payload?.message ?? "You have a new notification.";
  }

  return {
    id: raw.id,
    title,
    message,
    createdAt: raw.created_at,
    read: raw.is_read ?? false,
  };
};

interface NotificationState {
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  setNotifications: (list) =>
    set(() => ({
      notifications: list,
    })),

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications.filter((x) => x.id !== n.id)],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true,
      })),
    })),
}));

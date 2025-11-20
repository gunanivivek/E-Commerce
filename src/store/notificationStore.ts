/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../api/notificationApi";

export interface RawNotification {
  id: number;
  type: string;
  order_id: number;
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
  orderId: number;
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
    orderId: raw.order_id,
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

  markAsRead: async (id) => {
    try {
      const updated = await markNotificationReadApi(id);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: updated.is_read } : n
        ),
      }));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllNotificationsReadApi();

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
        })),
      }));
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  },
}));

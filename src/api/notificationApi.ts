import api from "./axiosInstance";
import type { RawNotification } from "../store/notificationStore";

export const fetchNotifications = async (): Promise<RawNotification[]> => {
  const res = await api.get("/notifications/history");
  return res.data;
};

export const markNotificationReadApi = async (id: number) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data; 
};

export const markAllNotificationsReadApi = async () => {
  const res = await api.patch("/notifications/read/all");
  return res.data; 
};

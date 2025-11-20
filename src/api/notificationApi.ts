import api from "./axiosInstance";
import type { RawNotification } from "../store/notificationStore";

export const fetchNotifications = async (): Promise<RawNotification[]> => {
  const res = await api.get("/notifications/history");
  return res.data;
};

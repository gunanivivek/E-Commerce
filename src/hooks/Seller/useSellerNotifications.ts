import { useQuery } from "@tanstack/react-query";
import { transformNotification, useNotificationStore } from "../../store/notificationStore";
import { fetchNotifications } from "../../api/notificationApi";
import { useEffect } from "react";

export const useSellerNotifications = () => {
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const query = useQuery({
    queryKey: ["seller-notifications"],
    queryFn: fetchNotifications,
    select: (raw) => raw.map(transformNotification),
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data);
    }
  }, [query.data]);

  return query;
};

import { useEffect, useRef } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { useAuthStore } from "../store/authStore";
import { transformNotification } from "../store/notificationStore";

export const useNotificationSocket = () => {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const user = useAuthStore((s) => s.user);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const connect = () => {
      const ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}?seller_id=${user.id}`
      );
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          const formatted = transformNotification(raw);
          addNotification(formatted);
        } catch (err) {
          console.log("Invalid WS message", err);
        }
      };

      ws.onclose = () => {
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [user?.id]);
};

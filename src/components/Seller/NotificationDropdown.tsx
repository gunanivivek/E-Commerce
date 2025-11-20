import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";
import { useSellerNotifications } from "../../hooks/Seller/useSellerNotifications";

const SellerNotificationDropdown = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { refetch } = useSellerNotifications(); // Load API notifications

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown = async () => {
    await refetch(); // fetch old notifications
    markAllAsRead(); // mark as read
    setOpen(!open);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={openDropdown}
        className="relative p-1.5 border border-border-light rounded-lg bg-primary-100/30 text-primary-300"
      >
        <Bell className="w-5 h-5 text-primary-300" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow-xl w-80 sm:w-96 max-w-[95vw] rounded-xl border border-border z-40">
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="font-heading text-lg text-accent-darker">Notifications</h2>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="font-semibold text-sm text-accent-dark break-words">{n.title}</p>
                  <p className="text-xs text-primary-300">{n.message}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerNotificationDropdown;

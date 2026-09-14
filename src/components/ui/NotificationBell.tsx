import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationDto } from "../../api/messaging";
import { BellIcon } from "../admin/icons";
import { useOutsideClick } from "./DropdownPanel";

interface NotificationBellProps {
  notificationsQueryKey: readonly unknown[];
  unreadCountQueryKey: readonly unknown[];
  fetchNotifications: () => Promise<NotificationDto[]>;
  markRead: (id: string) => Promise<NotificationDto>;
  getConversationLink: (notification: NotificationDto) => string | null;
}

export default function NotificationBell({
  notificationsQueryKey,
  unreadCountQueryKey,
  fetchNotifications,
  markRead,
  getConversationLink,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const { data: notifications = [] } = useQuery({ queryKey: notificationsQueryKey, queryFn: fetchNotifications });
  const markReadMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleSelect(notification: NotificationDto) {
    if (!notification.isRead) markReadMutation.mutate(notification.id);
    const link = getConversationLink(notification);
    setIsOpen(false);
    if (link) navigate(link);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Bildirimler"
        className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink transition hover:bg-assid-paper"
      >
        <BellIcon className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-red-500 px-1 text-[0.62rem] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-w-[90vw] overflow-hidden rounded-[14px] border border-assid-line bg-white shadow-card">
          <div className="border-b border-assid-line px-4 py-3 text-[0.85rem] font-extrabold text-assid-ink">
            Bildirimler
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-[0.85rem] text-assid-muted">Bildirim yok</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleSelect(notification)}
                  className={`flex w-full flex-col gap-0.5 border-b border-assid-line px-4 py-3 text-left text-[0.85rem] transition hover:bg-assid-paper last:border-b-0 ${
                    notification.isRead ? "bg-white" : "bg-assid-paper/60"
                  }`}
                >
                  <span className="font-bold text-assid-ink">{notification.title}</span>
                  <span className="text-assid-muted">{notification.body}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

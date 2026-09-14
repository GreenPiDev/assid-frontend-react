import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "../api/env";
import type { MessageDto } from "../api/messaging";
import { useAuth } from "./AuthContext";

const WS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export function MessagingSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const socket: Socket = io(WS_BASE_URL, { withCredentials: true });

    socket.on("new-message", (message: MessageDto) => {
      queryClient.invalidateQueries({ queryKey: ["messaging", "conversation", message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-conversation", message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-unread-count"] });
    });

    socket.on("unread-count-changed", () => {
      queryClient.invalidateQueries({ queryKey: ["messaging", "unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-unread-count"] });
      // Bir konuşma okunduğunda liste sayfasındaki (per-row) okunmamış noktası da
      // güncellensin diye konuşma listeleri de invalidate edilir.
      queryClient.invalidateQueries({ queryKey: ["messaging", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-conversations"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

  return <>{children}</>;
}

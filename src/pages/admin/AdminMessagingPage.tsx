import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminConversations } from "../../api/messaging";
import { PlusIcon } from "../../components/admin/icons";
import NewMessageModal from "../../components/messaging/NewMessageModal";

export default function AdminMessagingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["messaging", "admin-conversations"],
    queryFn: fetchAdminConversations,
  });

  function goToConversationWith(memberId: string) {
    const existing = conversations.find((c) => c.isAdminConversation && c.memberA.id === memberId);
    navigate(existing ? `/panel/mesajlasma/${existing.id}` : `/panel/mesajlasma/new?to=${memberId}`);
    setShowModal(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[1.5rem] tracking-[-.03em] text-assid-ink">Mesajlaşma</h1>
          <p className="mt-1 text-[0.85rem] text-assid-muted">
            Üye firmalar arasındaki konuşmalar salt okunurdur; "Yeni Mesaj" ile bir üyeyle doğrudan yazışabilirsiniz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Yeni Mesaj
        </button>
      </div>

      <div className="grid gap-2">
        {isLoading && <div className="text-[0.85rem] text-assid-muted">Yükleniyor...</div>}
        {!isLoading && conversations.length === 0 && (
          <div className="rounded-[16px] border border-assid-line bg-white p-6 text-[0.85rem] text-assid-muted">
            Henüz bir konuşma yok.
          </div>
        )}
        {conversations.map((conversation) => {
          const isUnread =
            conversation.lastMessage != null &&
            (conversation.adminReadAt == null ||
              new Date(conversation.lastMessage.createdAt) > new Date(conversation.adminReadAt));
          return (
            <Link
              key={conversation.id}
              to={`/panel/mesajlasma/${conversation.id}`}
              className={`flex items-center justify-between gap-4 rounded-[16px] border border-assid-line bg-white p-4 transition hover:bg-assid-paper ${
                isUnread ? "border-assid-green/40" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[0.92rem] font-bold text-assid-ink">
                    {conversation.memberA.companyName || conversation.memberA.fullName}
                    {" — "}
                    {conversation.isAdminConversation
                      ? "ASSİD Yönetimi"
                      : conversation.memberB?.companyName || conversation.memberB?.fullName}
                  </span>
                  {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />}
                </div>
                {conversation.lastMessage && (
                  <p className="truncate text-[0.82rem] text-assid-muted">{conversation.lastMessage.body}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {showModal && (
        <NewMessageModal onClose={() => setShowModal(false)} onSelectMember={goToConversationWith} />
      )}
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_MEMBER_ID, fetchConversations } from "../../api/messaging";
import { PlusIcon } from "../../components/admin/icons";
import NewMessageModal from "../../components/messaging/NewMessageModal";
import { useAuth } from "../../context/AuthContext";

export default function MemberMessagingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["messaging", "conversations"],
    queryFn: fetchConversations,
  });

  function goToConversationWith(otherId: string) {
    const existing = conversations.find((c) => c.otherMember.id === otherId);
    if (existing) {
      navigate(`/panel/mesaj/${existing.id}`);
    } else if (otherId === ADMIN_MEMBER_ID) {
      navigate("/panel/mesaj/new?admin=1");
    } else {
      navigate(`/panel/mesaj/new?to=${otherId}`);
    }
    setShowModal(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Üye Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Mesajlaşma</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Yeni Mesaj
        </button>
      </div>

      <div className="grid gap-2">
        {isLoading && <div className="text-[0.85rem] text-assid-muted">Yükleniyor...</div>}
        {!isLoading && conversations.length === 0 && (
          <div className="rounded-[16px] border border-assid-line bg-white p-6 text-[0.85rem] text-assid-muted">
            Henüz bir konuşmanız yok.
          </div>
        )}
        {conversations.map((conversation) => {
          const isUnread =
            conversation.lastMessage != null &&
            conversation.lastMessage.readAt == null &&
            (conversation.lastMessage.senderIsAdmin ||
              conversation.lastMessage.senderMemberId === conversation.otherMember.id);
          return (
            <Link
              key={conversation.id}
              to={`/panel/mesaj/${conversation.id}`}
              className={`flex items-center gap-4 rounded-[16px] border border-assid-line bg-white p-4 transition hover:bg-assid-paper ${
                isUnread ? "border-assid-green/40" : ""
              }`}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper">
                {conversation.otherMember.logo ? (
                  <img src={conversation.otherMember.logo} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <span className="text-[1rem] font-black text-assid-green">
                    {(conversation.otherMember.companyName || conversation.otherMember.fullName).charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[0.92rem] font-bold text-assid-ink">
                    {conversation.otherMember.companyName || conversation.otherMember.fullName}
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
        <NewMessageModal
          onClose={() => setShowModal(false)}
          excludeMemberId={user?.memberId}
          onSelectMember={goToConversationWith}
          onSelectAdmin={() => goToConversationWith(ADMIN_MEMBER_ID)}
        />
      )}
    </div>
  );
}

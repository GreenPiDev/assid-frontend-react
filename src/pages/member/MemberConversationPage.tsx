import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemberById } from "../../api/resources/members";
import { ADMIN_MEMBER_ID, fetchConversations, fetchMessages, sendMessage } from "../../api/messaging";
import { ArrowLeftIcon } from "../../components/admin/icons";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function MemberConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draft, setDraft] = useState("");

  const isNew = id === "new";
  const targetMemberId = searchParams.get("to");
  const isNewAdminTarget = isNew && searchParams.get("admin") === "1";

  const { data: conversations = [] } = useQuery({
    queryKey: ["messaging", "conversations"],
    queryFn: fetchConversations,
  });

  const currentConversation = !isNew ? conversations.find((c) => c.id === id) : undefined;
  const { data: targetMember } = useMemberById(isNew && !isNewAdminTarget ? targetMemberId : undefined);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messaging", "conversation", id],
    queryFn: () => fetchMessages(id as string),
    enabled: !isNew && !!id,
  });

  const otherMember = isNewAdminTarget
    ? { id: ADMIN_MEMBER_ID, companyName: "ASSİD Yönetimi", fullName: "ASSİD Yönetimi", logo: null }
    : isNew
      ? targetMember
        ? { id: targetMember.id, companyName: targetMember.name, fullName: targetMember.name, logo: targetMember.logo }
        : null
      : currentConversation?.otherMember;

  const isAdminThread = otherMember?.id === ADMIN_MEMBER_ID;

  const sendMutation = useMutation({
    mutationFn: (body: string) =>
      isAdminThread ? sendMessage({ toAdmin: true, body }) : sendMessage({ recipientMemberId: otherMember?.id, body }),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["messaging", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "conversation", message.conversationId] });
      if (isNew) {
        navigate(`/panel/mesaj/${message.conversationId}`, { replace: true });
      }
      setDraft("");
    },
    onError: (err) => showToast(err instanceof Error ? err.message : "Mesaj gönderilemedi."),
  });

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMutation.mutate(draft.trim());
  }

  return (
    <div className="flex h-[calc(100vh-64px-2.5rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/panel/mesajlasma")}
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-assid-line bg-white text-assid-ink transition hover:bg-assid-paper"
          aria-label="Geri"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <h1 className="text-[1.15rem] font-bold text-assid-ink">
          {otherMember?.companyName || otherMember?.fullName || "Mesajlaşma"}
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[20px] border border-assid-line bg-white">
        <div className="flex-1 space-y-2 overflow-y-auto p-5">
          {!isNew && isLoading && <div className="text-[0.85rem] text-assid-muted">Yükleniyor...</div>}
          {!isNew && !isLoading && messages.length === 0 && (
            <div className="text-[0.85rem] text-assid-muted">Henüz mesaj yok, ilk mesajı gönderin.</div>
          )}
          {isNew && (
            <div className="text-[0.85rem] text-assid-muted">Yeni bir konuşma başlatıyorsunuz.</div>
          )}
          {messages.map((message) => {
            const isMine = message.senderMemberId === user?.memberId;
            return (
              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-[14px] px-3.5 py-2 text-[0.88rem] ${
                    isMine ? "bg-assid-green text-white" : "bg-assid-paper text-assid-ink"
                  }`}
                >
                  {message.body}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 border-t border-assid-line p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
          <button
            type="submit"
            disabled={sendMutation.isPending || !draft.trim()}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemberById } from "../../api/resources/members";
import { fetchAdminConversations, fetchAdminMessages, sendMessageAsAdmin } from "../../api/messaging";
import { ArrowLeftIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

export default function AdminConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const isNew = id === "new";
  const targetMemberId = searchParams.get("to");

  const { data: conversations = [] } = useQuery({
    queryKey: ["messaging", "admin-conversations"],
    queryFn: fetchAdminConversations,
  });
  const conversation = !isNew ? conversations.find((c) => c.id === id) : undefined;
  const { data: targetMember } = useMemberById(isNew ? targetMemberId : undefined);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messaging", "admin-conversation", id],
    queryFn: () => fetchAdminMessages(id as string),
    enabled: !isNew && !!id,
  });

  const isAdminConversation = isNew || conversation?.isAdminConversation === true;
  const memberId = isNew ? targetMemberId : conversation?.memberA.id;
  const title = isNew
    ? targetMember?.name
    : conversation?.isAdminConversation
      ? conversation.memberA.companyName || conversation.memberA.fullName
      : conversation
        ? `${conversation.memberA.companyName || conversation.memberA.fullName} — ${
            conversation.memberB?.companyName || conversation.memberB?.fullName
          }`
        : "Konuşma";

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessageAsAdmin(memberId as string, body),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messaging", "admin-conversation", message.conversationId] });
      if (isNew) {
        navigate(`/panel/mesajlasma/${message.conversationId}`, { replace: true });
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
        <h1 className="text-[1.15rem] font-bold text-assid-ink">{title}</h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[20px] border border-assid-line bg-white">
        <div className="flex-1 space-y-2 overflow-y-auto p-5">
          {!isNew && isLoading && <div className="text-[0.85rem] text-assid-muted">Yükleniyor...</div>}
          {!isNew && !isLoading && messages.length === 0 && (
            <div className="text-[0.85rem] text-assid-muted">Bu konuşmada henüz mesaj yok.</div>
          )}
          {isNew && <div className="text-[0.85rem] text-assid-muted">Yeni bir konuşma başlatıyorsunuz.</div>}
          {messages.map((message) => {
            if (message.senderIsAdmin) {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[75%] rounded-[14px] bg-assid-green px-3.5 py-2 text-[0.88rem] text-white">
                    {message.body}
                  </div>
                </div>
              );
            }

            const isFromMemberA = !conversation || message.senderMemberId === conversation.memberA.id;
            const senderName = conversation
              ? isFromMemberA
                ? conversation.memberA.companyName || conversation.memberA.fullName
                : conversation.memberB?.companyName || conversation.memberB?.fullName
              : "";

            return (
              <div key={message.id} className={`flex flex-col ${isFromMemberA ? "items-start" : "items-end"}`}>
                {!isAdminConversation && (
                  <span className="mb-0.5 px-1 text-[0.7rem] font-bold text-assid-muted">{senderName}</span>
                )}
                <div
                  className={`max-w-[75%] rounded-[14px] px-3.5 py-2 text-[0.88rem] ${
                    isFromMemberA ? "bg-assid-paper text-assid-ink" : "bg-slate-200 text-assid-ink"
                  }`}
                >
                  {message.body}
                </div>
              </div>
            );
          })}
        </div>

        {isAdminConversation ? (
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
        ) : (
          <div className="border-t border-assid-line px-5 py-3 text-center text-[0.78rem] text-assid-muted">
            Bu, iki üye firma arasındaki bir konuşmadır — sadece görüntüleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
}

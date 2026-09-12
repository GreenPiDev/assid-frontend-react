import { usePosts, type Post } from "../../api/resources/posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function CompanyFeed({
  memberId,
  onDelete,
  deletingId,
}: {
  memberId: string;
  onDelete?: (post: Post) => void;
  deletingId?: string;
}) {
  const { data: posts, isLoading } = usePosts(memberId);

  if (isLoading) {
    return <p className="text-[0.85rem] text-assid-muted">Yükleniyor...</p>;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-[0.85rem] text-assid-muted">Henüz gönderi paylaşılmamış.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded-2xl border border-assid-line bg-assid-paper p-4.5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[0.74rem] font-bold text-assid-muted">{formatDate(post.createdAt)}</span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(post)}
                disabled={deletingId === post.id}
                className="cursor-pointer border-0 bg-transparent text-[0.78rem] font-bold text-assid-muted hover:text-[#c0392b] disabled:opacity-50"
              >
                Sil
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap text-[0.95rem] leading-snug text-assid-ink">{post.body}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Gönderi görseli" className="mt-3 max-h-[420px] w-full rounded-[14px] object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}

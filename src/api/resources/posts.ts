import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../env";

export interface Post {
  id: string;
  memberId: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
}

interface BackendPost {
  _id: string;
  memberId: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
}

function toFrontendPost(p: BackendPost): Post {
  return { id: p._id, memberId: p.memberId, body: p.body, imageUrl: p.imageUrl, createdAt: p.createdAt };
}

async function parseErrorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
  const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
  return message ?? `İstek başarısız (${res.status})`;
}

export function postsQueryKey(memberId: string) {
  return ["posts", memberId];
}

export function usePosts(memberId: string | null | undefined) {
  return useQuery({
    queryKey: postsQueryKey(memberId ?? ""),
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/posts?memberId=${memberId}`);
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const list = (await res.json()) as BackendPost[];
      return list.map(toFrontendPost);
    },
    enabled: !!memberId,
    staleTime: 30_000,
  });
}

export function usePostsInvalidate(memberId: string | null | undefined) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: postsQueryKey(memberId ?? "") });
}

export async function createPost(body: string, image?: File): Promise<Post> {
  const formData = new FormData();
  formData.append("body", body);
  if (image) formData.append("image", image);
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return toFrontendPost((await res.json()) as BackendPost);
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

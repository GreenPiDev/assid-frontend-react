import { Paths, useGetList } from "../factory";
import type { BackendBoardMember } from "../client";

// GET /board-members — dernek yönetimi kurul üyeleri
export function useBoardMembers() {
  const query = useGetList(Paths.BoardMembers);
  return { ...query, data: query.data as BackendBoardMember[] };
}

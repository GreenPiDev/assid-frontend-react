import { Paths, useGetList } from "../factory";
import type { BackendMembershipFee } from "../client";

// GET /membership-fees — üyelik başvuru sayfasındaki ücret tablosu
export function useMembershipFees() {
  const query = useGetList(Paths.MembershipFees);
  return { ...query, data: query.data as BackendMembershipFee[] };
}

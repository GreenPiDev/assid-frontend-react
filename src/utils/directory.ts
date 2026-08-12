import { SECTORS } from "../constants/sectors";
import type { Member } from "../types";

export function getSectorName(slug?: string | null) {
  return SECTORS.find((s) => s.slug === slug)?.name ?? slug ?? "";
}

export function getActivityAreasForMembers(members: Member[]) {
  const tagSet = new Set<string>();
  members.forEach((m) => (m.activityAreas || []).forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "tr"));
}

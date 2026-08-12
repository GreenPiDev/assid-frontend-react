const dayFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit" });
const monthFormatter = new Intl.DateTimeFormat("tr-TR", { month: "long" });
const fullDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" });

export function formatEventDay(date: string) {
  return dayFormatter.format(new Date(date));
}

export function formatEventMonth(date: string) {
  const month = monthFormatter.format(new Date(date));
  return month.charAt(0).toLocaleUpperCase("tr-TR") + month.slice(1);
}

export function formatEventDateTime(date: string) {
  return `${fullDateFormatter.format(new Date(date))} · ${timeFormatter.format(new Date(date))}`;
}

export function formatEventTime(date: string) {
  return timeFormatter.format(new Date(date));
}

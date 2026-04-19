export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
  }).format(date);
}

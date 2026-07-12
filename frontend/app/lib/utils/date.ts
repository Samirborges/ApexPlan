import { format, parseISO } from "date-fns";

export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return format(parseISO(dateString), "dd/MM/yyyy");
}
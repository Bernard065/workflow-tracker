import type { ApplicationStatus } from "@/types/application";

export const statusBadgeClasses: Record<ApplicationStatus, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-700",
  need_more_information: "border-rose-200 bg-rose-50 text-rose-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export const statusDotClasses: Record<ApplicationStatus, string> = {
  draft: "bg-slate-400",
  submitted: "bg-sky-500",
  under_review: "bg-amber-500",
  need_more_information: "bg-rose-500",
  approved: "bg-emerald-500",
  rejected: "bg-red-500",
};

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

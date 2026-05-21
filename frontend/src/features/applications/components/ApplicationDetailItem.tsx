interface ApplicationDetailItemProps {
  label: string;
  value: string | null | undefined;
}

export function ApplicationDetailItem({ label, value }: ApplicationDetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-950">
        {value || "Not available"}
      </p>
    </div>
  );
}

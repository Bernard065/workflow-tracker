import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock3, Layers3 } from "lucide-react";

interface ApplicationStatsProps {
  totalApplications: number;
  activeApplications: number;
  approvedApplications: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
        </div>

        <div className="rounded-2xl bg-white/15 p-3 text-cyan-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

export function ApplicationStats({
  totalApplications,
  activeApplications,
  approvedApplications,
}: ApplicationStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Total applications" value={totalApplications} icon={Layers3} />
      <StatCard label="Active workflow" value={activeApplications} icon={Clock3} />
      <StatCard label="Approved" value={approvedApplications} icon={CheckCircle2} />
    </div>
  );
}

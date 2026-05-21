import { motion } from "framer-motion";
import { Plus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { ApplicationStats } from "./ApplicationStats";

interface ApplicationListHeaderProps {
  totalApplications: number;
  activeApplications: number;
  approvedApplications: number;
}

export function ApplicationListHeader({
  totalApplications,
  activeApplications,
  approvedApplications,
}: ApplicationListHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-2xl shadow-slate-950/30 sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-100 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Application Workflow Tracker
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Applications
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A modern workspace to track drafts, submissions, reviews, requests for
              more information, approvals, and rejections with clarity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
            className="flex lg:justify-end"
          >
            <Button
              asChild
              size="lg"
              className="group rounded-full border border-cyan-200/70 bg-cyan-300! px-6 font-bold text-slate-950! shadow-xl shadow-cyan-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-200! hover:text-slate-950! hover:shadow-cyan-900/40 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Link to="/applications/new">
                <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                Create Application
              </Link>
            </Button>
          </motion.div>
        </div>

        <ApplicationStats
          totalApplications={totalApplications}
          activeApplications={activeApplications}
          approvedApplications={approvedApplications}
        />
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FileText, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function ApplicationEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[380px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm"
    >
      <div className="mb-5 rounded-full bg-gradient-to-br from-cyan-100 to-emerald-100 p-5 text-cyan-700">
        <FileText className="h-9 w-9" />
      </div>

      <div className="mb-2 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
        <Sparkles className="h-4 w-4 text-cyan-600" />
        Ready to begin
      </div>

      <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
        No applications yet
      </h2>

      <p className="mt-3 max-w-md text-slate-600">
        Create your first draft application and move it through the workflow from
        submission to final decision.
      </p>

      <Button asChild className="mt-6 rounded-full px-6">
        <Link to="/applications/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Application
        </Link>
      </Button>
    </motion.div>
  );
}

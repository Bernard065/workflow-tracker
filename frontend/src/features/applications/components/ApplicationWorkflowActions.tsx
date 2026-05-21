import { Edit3, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Application } from "@/types/application";
import {
  canEditApplication,
  canRecordDecision,
  canStartReview,
  canSubmitApplication,
} from "@/utils/status";

interface ApplicationWorkflowActionsProps {
  application: Application;
  isProcessing: boolean;
  onSubmitApplication: () => Promise<void>;
  onStartReview: () => Promise<void>;
}

export function ApplicationWorkflowActions({
  application,
  isProcessing,
  onSubmitApplication,
  onStartReview,
}: ApplicationWorkflowActionsProps) {
  const status = application.status;

  if (status === "approved" || status === "rejected") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-white shadow-lg shadow-black/10 backdrop-blur">
        <p className="font-bold">Final decision recorded</p>
        <p className="mt-1 text-sm text-slate-300">
          This application has reached a final status and cannot be edited.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
      {canEditApplication(status) && (
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white/30 bg-white px-5 font-bold text-slate-950 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-50 hover:text-slate-950"
        >
          <Link to={`/applications/${application.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      )}

      {canSubmitApplication(status) && (
        <Button
          type="button"
          disabled={isProcessing}
          className="rounded-full bg-cyan-400 px-5 font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={() => void onSubmitApplication()}
        >
          <Send className="mr-2 h-4 w-4" />
          {status === "need_more_information" ? "Resubmit" : "Submit"}
        </Button>
      )}

      {canStartReview(status) && (
        <Button
          type="button"
          disabled={isProcessing}
          className="rounded-full bg-cyan-400 px-5 font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={() => void onStartReview()}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Start Review
        </Button>
      )}

      {canRecordDecision(status) && (
        <div className="max-w-md rounded-3xl border border-cyan-200/30 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-100 shadow-lg shadow-black/10 backdrop-blur">
          This application is under review. Use the reviewer decision form below to
          approve, reject, or request more information.
        </div>
      )}
    </div>
  );
}

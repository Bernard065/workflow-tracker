import { CheckCircle2, Edit3, FileQuestion, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Application } from "@/types/application";
import {
  canRecordDecision,
  canStartReview,
  canSubmitApplication,
  canEditApplication,
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
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="font-bold text-slate-950">Final decision recorded</p>
        <p className="mt-1 text-sm text-slate-600">
          This application has reached a final status and cannot be edited.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          onClick={() => void onStartReview()}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Start Review
        </Button>
      )}

      {canRecordDecision(status) && (
        <>
          <Button
            type="button"
            className="rounded-full bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-full border-amber-200 bg-amber-50 px-5 font-bold text-amber-800 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100 hover:text-amber-900"
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            Need More Information
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="rounded-full bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
          >
            Reject
          </Button>
        </>
      )}
    </div>
  );
}

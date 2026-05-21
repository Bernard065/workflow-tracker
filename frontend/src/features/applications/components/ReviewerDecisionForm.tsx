import { CheckCircle2, FileQuestion, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Application, ReviewerDecisionPayload } from "@/types/application";

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

type ReviewerDecision = ReviewerDecisionPayload["decision"];

interface ReviewerDecisionFormProps {
  application: Application;
  isSubmitting: boolean;
  onSubmit: (payload: ReviewerDecisionPayload) => Promise<void>;
}

const decisionOptions: {
  label: string;
  value: ReviewerDecision;
  icon: typeof CheckCircle2;
  className: string;
}[] = [
  {
    label: "Approve",
    value: "approved",
    icon: CheckCircle2,
    className: "bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white",
  },
  {
    label: "Need More Information",
    value: "need_more_information",
    icon: FileQuestion,
    className:
      "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900",
  },
  {
    label: "Reject",
    value: "rejected",
    icon: XCircle,
    className: "bg-red-600 text-white hover:bg-red-500 hover:text-white",
  },
];

function requiresComment(decision: ReviewerDecision): boolean {
  return decision === "need_more_information" || decision === "rejected";
}

export function ReviewerDecisionForm({
  application,
  isSubmitting,
  onSubmit,
}: ReviewerDecisionFormProps) {
  const [decision, setDecision] = useState<ReviewerDecision>("approved");
  const [reviewerComment, setReviewerComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    if (requiresComment(decision) && !reviewerComment.trim()) {
      setErrorMessage(
        "Reviewer comment is required for Need More Information or Rejected decisions.",
      );
      return;
    }

    setErrorMessage(null);

    await onSubmit({
      decision,
      reviewer_comment: reviewerComment.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">Reviewer decision</h2>
        <p className="mt-1 text-sm text-slate-500">
          Record the outcome for {application.tracking_number}. Comments are required
          when requesting more information or rejecting the application.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {decisionOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = decision === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              variant={option.value === "need_more_information" ? "outline" : "default"}
              className={`h-12 rounded-full font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
                option.className
              } ${isSelected ? "ring-2 ring-slate-950 ring-offset-2" : ""}`}
              onClick={() => {
                setDecision(option.value);
                setErrorMessage(null);
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="reviewer_comment" className="font-bold">
          Reviewer comment
        </Label>
        <Textarea
          id="reviewer_comment"
          value={reviewerComment}
          placeholder={
            requiresComment(decision)
              ? "Explain what is needed or why the application is rejected..."
              : "Optional comment for approval..."
          }
          className="min-h-32 resize-y rounded-2xl bg-slate-50 leading-7"
          onChange={(event) => {
            setReviewerComment(event.target.value);
            setErrorMessage(null);
          }}
        />

        {errorMessage && (
          <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-full bg-slate-950 px-7 font-black text-white hover:bg-slate-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving decision...
            </>
          ) : (
            "Record Decision"
          )}
        </Button>
      </div>
    </form>
  );
}

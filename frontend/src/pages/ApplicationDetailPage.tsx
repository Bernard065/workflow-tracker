import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getApplication,
  recordReviewerDecision,
  startReview,
  submitApplication,
} from "@/api/applications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationDetailItem } from "@/features/applications/components/ApplicationDetailItem";
import { ApplicationStatusBadge } from "@/features/applications/components/ApplicationStatusBadge";
import { ApplicationWorkflowActions } from "@/features/applications/components/ApplicationWorkflowActions";
import { ReviewerDecisionForm } from "@/features/applications/components/ReviewerDecisionForm";
import { formatDate } from "@/features/applications/utils";
import type { Application, ReviewerDecisionPayload } from "@/types/application";
import { formatApplicationType } from "@/utils/status";

function formatOptionalDate(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  return formatDate(value);
}

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (!applicationId) {
      queueMicrotask(() => {
        if (!isActive) {
          return;
        }

        setApplication(null);
        setErrorMessage("Application ID is missing.");
        setIsLoading(false);
      });

      return () => {
        isActive = false;
      };
    }

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
    });

    void getApplication(applicationId)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setApplication(data);
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load application details.";

        setApplication(null);
        setErrorMessage(message);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [applicationId]);

  async function handleSubmitApplication() {
    if (!application) {
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const updatedApplication = await submitApplication(application.id);

      setApplication(updatedApplication);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit application.";

      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleStartReview() {
    if (!application) {
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const updatedApplication = await startReview(application.id);

      setApplication(updatedApplication);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start review.";

      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleReviewerDecision(payload: ReviewerDecisionPayload) {
    if (!application) {
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const updatedApplication = await recordReviewerDecision(application.id, payload);

      setApplication(updatedApplication);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to record reviewer decision.";

      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#172554_100%)]" />

      <section className="mx-auto max-w-6xl space-y-6">
        <Button
          asChild
          variant="ghost"
          className="rounded-full px-4 font-bold text-slate-100! transition-all duration-200 hover:bg-white/10! hover:text-white!"
        >
          <Link to="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to applications
          </Link>
        </Button>

        {isLoading && (
          <Card className="border-white/80 bg-slate-50/95 shadow-2xl">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-8 w-1/2 animate-pulse rounded-full bg-slate-200" />
                <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                  <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!isLoading && application && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <Card className="overflow-hidden border-white/80 bg-slate-50/95 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <CardHeader className="border-b bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div>
                    <div className="mb-4">
                      <ApplicationStatusBadge status={application.status} />
                    </div>

                    <CardTitle className="text-3xl font-black tracking-tight sm:text-5xl">
                      {application.tracking_number}
                    </CardTitle>

                    <p className="mt-4 max-w-2xl text-slate-300">
                      {formatApplicationType(application.application_type)} for{" "}
                      {application.company_name}
                    </p>
                  </div>

                  <ApplicationWorkflowActions
                    application={application}
                    isProcessing={isProcessing}
                    onSubmitApplication={handleSubmitApplication}
                    onStartReview={handleStartReview}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <ApplicationDetailItem
                    label="Applicant"
                    value={application.applicant_name}
                  />
                  <ApplicationDetailItem
                    label="Email"
                    value={application.applicant_email}
                  />
                  <ApplicationDetailItem
                    label="Company"
                    value={application.company_name}
                  />
                  <ApplicationDetailItem
                    label="Application Type"
                    value={formatApplicationType(application.application_type)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <ApplicationDetailItem
                    label="Created"
                    value={formatOptionalDate(application.created_at)}
                  />
                  <ApplicationDetailItem
                    label="Updated"
                    value={formatOptionalDate(application.updated_at)}
                  />
                  <ApplicationDetailItem
                    label="Submitted"
                    value={formatOptionalDate(application.submitted_at)}
                  />
                  <ApplicationDetailItem
                    label="Reviewed"
                    value={formatOptionalDate(application.reviewed_at)}
                  />
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-black">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-7 text-slate-700">
                      {application.description}
                    </p>
                  </CardContent>
                </Card>

                {application.status === "under_review" && (
                  <ReviewerDecisionForm
                    application={application}
                    isSubmitting={isProcessing}
                    onSubmit={handleReviewerDecision}
                  />
                )}

                {application.reviewer_comment && (
                  <Card className="border-cyan-200 bg-cyan-50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-black text-slate-950">
                        Reviewer Comment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line leading-7 text-slate-700">
                        {application.reviewer_comment}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>
    </main>
  );
}

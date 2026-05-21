import { motion } from "framer-motion";
import { ArrowLeft, FilePlus2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createApplication } from "@/api/applications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import type { ApplicationCreatePayload } from "@/types/application";

export function ApplicationFormPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreateApplication(payload: ApplicationCreatePayload) {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const application = await createApplication(payload);

      navigate(`/applications/${application.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create application.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#172554_100%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />

      <section className="mx-auto max-w-5xl space-y-6">
        <Button
          asChild
          variant="ghost"
          className="rounded-full px-4 font-bold text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <Link to="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to applications
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <Card className="overflow-hidden border-white/80 bg-slate-50/95 shadow-2xl shadow-slate-950/25 backdrop-blur">
            <CardHeader className="border-b bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-100 shadow-sm backdrop-blur">
                    <ShieldCheck className="h-4 w-4" />
                    Draft application
                  </div>

                  <CardTitle className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                    Create application draft
                  </CardTitle>

                  <CardDescription className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    Capture applicant, company, and application details. The record is
                    saved as a draft before it is submitted for review.
                  </CardDescription>
                </div>

                <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-cyan-100 shadow-xl shadow-black/10 md:block">
                  <FilePlus2 className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Unable to create application</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <ApplicationForm
                submitLabel="Create Draft"
                isSubmitting={isSubmitting}
                onSubmit={handleCreateApplication}
              />
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}

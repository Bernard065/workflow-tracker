import { ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <Button asChild variant="ghost" className="text-white hover:text-white">
          <Link to="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to applications
          </Link>
        </Button>

        <Card className="border-white/80 bg-slate-50/95 shadow-2xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-3xl font-black tracking-tight">
              Create application draft
            </CardTitle>
            <CardDescription>
              Add applicant and company details. The application will be saved as a
              draft before submission.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive">
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
      </section>
    </main>
  );
}

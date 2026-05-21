import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationCreatePayload, ApplicationType } from "@/types/application";

import { applicationTypeOptions } from "../constants";

interface ApplicationFormProps {
  initialValues?: Partial<ApplicationCreatePayload>;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (payload: ApplicationCreatePayload) => Promise<void>;
}

interface FormErrors {
  applicant_name?: string;
  applicant_email?: string;
  company_name?: string;
  application_type?: string;
  description?: string;
}

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

const defaultFormValues: ApplicationCreatePayload = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: "recordation",
  description: "",
};

function validateForm(values: ApplicationCreatePayload): FormErrors {
  const errors: FormErrors = {};

  if (!values.applicant_name.trim()) {
    errors.applicant_name = "Applicant name is required.";
  }

  if (!values.applicant_email.trim()) {
    errors.applicant_email = "Applicant email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.applicant_email)) {
    errors.applicant_email = "Enter a valid email address.";
  }

  if (!values.company_name.trim()) {
    errors.company_name = "Company name is required.";
  }

  if (!values.application_type) {
    errors.application_type = "Application type is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  return errors;
}

export function ApplicationForm({
  initialValues,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationCreatePayload>({
    ...defaultFormValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function updateField<Field extends keyof ApplicationCreatePayload>(
    field: Field,
    value: ApplicationCreatePayload[Field],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    const validationErrors = validateForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-950">Applicant details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Provide the primary applicant information for this workflow record.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="applicant_name" className="font-bold">
              Applicant name
            </Label>
            <Input
              id="applicant_name"
              value={values.applicant_name}
              placeholder="Jane Doe"
              className="h-12 rounded-2xl bg-slate-50"
              onChange={(event) => updateField("applicant_name", event.target.value)}
            />
            {errors.applicant_name && (
              <p className="text-sm font-medium text-red-600">
                {errors.applicant_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicant_email" className="font-bold">
              Applicant email
            </Label>
            <Input
              id="applicant_email"
              type="email"
              value={values.applicant_email}
              placeholder="jane@example.com"
              className="h-12 rounded-2xl bg-slate-50"
              onChange={(event) => updateField("applicant_email", event.target.value)}
            />
            {errors.applicant_email && (
              <p className="text-sm font-medium text-red-600">
                {errors.applicant_email}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-950">Company and application</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select the application type and add the company details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="font-bold">
              Company name
            </Label>
            <Input
              id="company_name"
              value={values.company_name}
              placeholder="Acme Holdings Ltd"
              className="h-12 rounded-2xl bg-slate-50"
              onChange={(event) => updateField("company_name", event.target.value)}
            />
            {errors.company_name && (
              <p className="text-sm font-medium text-red-600">{errors.company_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Application type</Label>
            <Select
              value={values.application_type}
              onValueChange={(value) =>
                updateField("application_type", value as ApplicationType)
              }
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
                <SelectValue placeholder="Select application type" />
              </SelectTrigger>

              <SelectContent>
                {applicationTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.application_type && (
              <p className="text-sm font-medium text-red-600">
                {errors.application_type}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-950">Application description</h2>
          <p className="mt-1 text-sm text-slate-500">
            Describe the purpose of the application clearly enough for review.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-bold">
            Description
          </Label>
          <Textarea
            id="description"
            value={values.description}
            placeholder="Describe the purpose of this application..."
            className="min-h-40 resize-y rounded-2xl bg-slate-50 leading-7"
            onChange={(event) => updateField("description", event.target.value)}
          />
          {errors.description && (
            <p className="text-sm font-medium text-red-600">{errors.description}</p>
          )}
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-3 rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-full bg-cyan-400 px-7 font-black text-slate-950 shadow-lg shadow-cyan-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving draft...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="applicant_name">Applicant name</Label>
          <Input
            id="applicant_name"
            value={values.applicant_name}
            placeholder="Jane Doe"
            onChange={(event) => updateField("applicant_name", event.target.value)}
          />
          {errors.applicant_name && (
            <p className="text-sm font-medium text-red-600">{errors.applicant_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicant_email">Applicant email</Label>
          <Input
            id="applicant_email"
            type="email"
            value={values.applicant_email}
            placeholder="jane@example.com"
            onChange={(event) => updateField("applicant_email", event.target.value)}
          />
          {errors.applicant_email && (
            <p className="text-sm font-medium text-red-600">{errors.applicant_email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company name</Label>
          <Input
            id="company_name"
            value={values.company_name}
            placeholder="Acme Holdings Ltd"
            onChange={(event) => updateField("company_name", event.target.value)}
          />
          {errors.company_name && (
            <p className="text-sm font-medium text-red-600">{errors.company_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Application type</Label>
          <Select
            value={values.application_type}
            onValueChange={(value) =>
              updateField("application_type", value as ApplicationType)
            }
          >
            <SelectTrigger>
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description}
          placeholder="Describe the purpose of this application..."
          className="min-h-36 resize-y"
          onChange={(event) => updateField("description", event.target.value)}
        />
        {errors.description && (
          <p className="text-sm font-medium text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
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

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicationStatus } from "@/types/application";

import { applicationTypeOptions } from "../constants";

const statusOptions: {
  label: string;
  value: ApplicationStatus;
}[] = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Submitted",
    value: "submitted",
  },
  {
    label: "Under Review",
    value: "under_review",
  },
  {
    label: "Need More Information",
    value: "need_more_information",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

interface ApplicationListFiltersProps {
  search: string;
  status: string;
  applicationType: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApplicationTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

const ALL_STATUSES_VALUE = "all_statuses";
const ALL_TYPES_VALUE = "all_types";

export function ApplicationListFilters({
  search,
  status,
  applicationType,
  onSearchChange,
  onStatusChange,
  onApplicationTypeChange,
  onClearFilters,
}: ApplicationListFiltersProps) {
  const hasActiveFilters = Boolean(search || status || applicationType);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
        <SlidersHorizontal className="h-4 w-4 text-cyan-600" />
        Search and filters
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_220px_240px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            placeholder="Search tracking number, applicant, email, or company..."
            className="h-12 rounded-2xl bg-slate-50 pl-10"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <Select
          value={status || ALL_STATUSES_VALUE}
          onValueChange={(value) =>
            onStatusChange(value === ALL_STATUSES_VALUE ? "" : value)
          }
        >
          <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={applicationType || ALL_TYPES_VALUE}
          onValueChange={(value) =>
            onApplicationTypeChange(value === ALL_TYPES_VALUE ? "" : value)
          }
        >
          <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
            <SelectValue placeholder="All application types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_TYPES_VALUE}>All application types</SelectItem>
            {applicationTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          className="h-12 rounded-2xl px-5 font-bold"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}

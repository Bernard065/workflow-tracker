import type { ApplicationType } from "@/types/application";

export const applicationTypeOptions: {
  label: string;
  value: ApplicationType;
}[] = [
  {
    label: "Recordation",
    value: "recordation",
  },
  {
    label: "Renewal",
    value: "renewal",
  },
  {
    label: "Change of Ownership",
    value: "change_of_ownership",
  },
  {
    label: "Change of Name",
    value: "change_of_name",
  },
  {
    label: "Discontinuation",
    value: "discontinuation",
  },
];

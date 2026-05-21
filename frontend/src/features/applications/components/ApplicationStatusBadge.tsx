import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types/application";
import { formatApplicationStatus } from "@/utils/status";

import { statusBadgeClasses, statusDotClasses } from "../utils";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`gap-2 rounded-full px-3 py-1 font-semibold shadow-sm ${statusBadgeClasses[status]}`}
    >
      <span className={`h-2 w-2 rounded-full ${statusDotClasses[status]}`} />
      {formatApplicationStatus(status)}
    </Badge>
  );
}

export type ApplicationType =
  | "recordation"
  | "renewal"
  | "change_of_ownership"
  | "change_of_name"
  | "discontinuation";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "need_more_information"
  | "approved"
  | "rejected";

export interface Application {
  id: string;
  tracking_number: string;
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
  status: ApplicationStatus;
  reviewer_comment: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export type ApplicationListItem = Pick<
  Application,
  | "id"
  | "tracking_number"
  | "applicant_name"
  | "company_name"
  | "application_type"
  | "status"
  | "created_at"
>;

export interface ApplicationCreatePayload {
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
}

export type ApplicationUpdatePayload = Partial<ApplicationCreatePayload>;

export interface ReviewerDecisionPayload {
  decision: Extract<
    ApplicationStatus,
    "need_more_information" | "approved" | "rejected"
  >;
  reviewer_comment: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

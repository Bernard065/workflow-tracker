from datetime import datetime
from uuid import UUID

from ninja import Schema
from pydantic import EmailStr

from .models import ApplicationStatus, ApplicationType


class ApplicationCreateSchema(Schema):
    applicant_name: str
    applicant_email: EmailStr
    company_name: str
    application_type: ApplicationType
    description: str


class ApplicationUpdateSchema(Schema):
    applicant_name: str | None = None
    applicant_email: EmailStr | None = None
    company_name: str | None = None
    application_type: ApplicationType | None = None
    description: str | None = None


class ReviewerDecisionSchema(Schema):
    decision: ApplicationStatus
    reviewer_comment: str | None = ""


class ApplicationOutSchema(Schema):
    id: UUID
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: ApplicationType
    description: str
    status: ApplicationStatus
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None
    reviewed_at: datetime | None


class ApplicationListSchema(Schema):
    id: UUID
    tracking_number: str
    applicant_name: str
    company_name: str
    application_type: ApplicationType
    status: ApplicationStatus
    created_at: datetime


class PaginatedApplicationListSchema(Schema):
    items: list[ApplicationListSchema]
    total: int
    page: int
    page_size: int
    total_pages: int
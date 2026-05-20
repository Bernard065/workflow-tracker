from datetime import datetime
from typing import Optional
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
    applicant_name: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    application_type: Optional[ApplicationType] = None
    description: Optional[str] = None


class ReviewerDecisionSchema(Schema):
    decision: ApplicationStatus
    reviewer_comment: Optional[str] = ""


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
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]


class ApplicationListSchema(Schema):
    id: UUID
    tracking_number: str
    applicant_name: str
    company_name: str
    application_type: ApplicationType
    status: ApplicationStatus
    created_at: datetime

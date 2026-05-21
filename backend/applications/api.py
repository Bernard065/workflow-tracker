from typing import List
from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import Router, Status

from .models import Application
from .schemas import (
    ApplicationCreateSchema,
    ApplicationListSchema,
    ApplicationOutSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
)
from .services import (
    record_reviewer_decision,
    start_review,
    submit_application,
    validate_can_edit,
)
from .utils import generate_tracking_number

router = Router(tags=["Applications"])


@router.post("", response={201: ApplicationOutSchema})
def create_application(request, payload: ApplicationCreateSchema):
    application = Application.objects.create(
        tracking_number=generate_tracking_number(),
        applicant_name=payload.applicant_name,
        applicant_email=payload.applicant_email,
        company_name=payload.company_name,
        application_type=payload.application_type,
        description=payload.description,
    )

    return Status(201, application)


@router.get("", response=List[ApplicationListSchema])
def list_applications(request):
    return Application.objects.all()


@router.get("/{application_id}", response=ApplicationOutSchema)
def get_application(request, application_id: UUID):
    return get_object_or_404(Application, id=application_id)


@router.patch("/{application_id}", response=ApplicationOutSchema)
def update_application(
    request,
    application_id: UUID,
    payload: ApplicationUpdateSchema,
):
    application = get_object_or_404(Application, id=application_id)

    validate_can_edit(application)

    data = payload.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(application, field, value)

    application.save()

    return application


@router.post("/{application_id}/submit", response=ApplicationOutSchema)
def submit_application_endpoint(request, application_id: UUID):
    application = get_object_or_404(Application, id=application_id)

    return submit_application(application)


@router.post("/{application_id}/start-review", response=ApplicationOutSchema)
def start_review_endpoint(request, application_id: UUID):
    application = get_object_or_404(Application, id=application_id)

    return start_review(application)


@router.post("/{application_id}/decision", response=ApplicationOutSchema)
def reviewer_decision_endpoint(
    request,
    application_id: UUID,
    payload: ReviewerDecisionSchema,
):
    application = get_object_or_404(Application, id=application_id)

    return record_reviewer_decision(
        application=application,
        decision=payload.decision,
        reviewer_comment=payload.reviewer_comment or "",
    )
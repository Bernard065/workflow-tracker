from django.db import transaction
from django.utils import timezone
from ninja.errors import HttpError

from .models import Application, ApplicationStatus


def validate_can_edit(application: Application) -> None:
    if application.status not in [
        ApplicationStatus.DRAFT,
        ApplicationStatus.NEED_MORE_INFORMATION,
    ]:
        raise HttpError(
            400,
            "Only draft or need-more-information applications can be edited.",
        )


def submit_application(application: Application) -> Application:
    if application.status not in [
        ApplicationStatus.DRAFT,
        ApplicationStatus.NEED_MORE_INFORMATION,
    ]:
        raise HttpError(
            400,
            "Only draft or need-more-information applications can be submitted.",
        )

    application.status = ApplicationStatus.SUBMITTED
    application.submitted_at = timezone.now()
    application.reviewer_comment = ""

    application.save(
        update_fields=[
            "status",
            "submitted_at",
            "reviewer_comment",
            "updated_at",
        ]
    )

    return application


def start_review(application: Application) -> Application:
    if application.status != ApplicationStatus.SUBMITTED:
        raise HttpError(
            400,
            "Only submitted applications can move to under review.",
        )

    application.status = ApplicationStatus.UNDER_REVIEW
    application.save(update_fields=["status", "updated_at"])

    return application


@transaction.atomic
def record_reviewer_decision(
    application: Application,
    decision: str,
    reviewer_comment: str = "",
) -> Application:
    if application.status != ApplicationStatus.UNDER_REVIEW:
        raise HttpError(
            400,
            "Only under-review applications can receive a reviewer decision.",
        )

    allowed_decisions = [
        ApplicationStatus.NEED_MORE_INFORMATION,
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
    ]

    if decision not in allowed_decisions:
        raise HttpError(400, "Invalid reviewer decision.")

    if decision in [
        ApplicationStatus.NEED_MORE_INFORMATION,
        ApplicationStatus.REJECTED,
    ] and not reviewer_comment.strip():
        raise HttpError(
            400,
            "Reviewer comment is required for Need More Information or Rejected decisions.",
        )

    application.status = decision
    application.reviewer_comment = reviewer_comment
    application.reviewed_at = timezone.now()

    application.save(
        update_fields=[
            "status",
            "reviewer_comment",
            "reviewed_at",
            "updated_at",
        ]
    )

    return application

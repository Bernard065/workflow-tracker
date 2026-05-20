import pytest
from ninja.errors import HttpError

from applications.models import Application, ApplicationStatus, ApplicationType
from applications.services import (
    record_reviewer_decision,
    start_review,
    submit_application,
    validate_can_edit,
)


@pytest.fixture
def application():
    return Application.objects.create(
        tracking_number="APP-2026-TEST001",
        applicant_name="John Doe",
        applicant_email="john@example.com",
        company_name="Doe Holdings Ltd",
        application_type=ApplicationType.RECORDATION,
        description="Test application description.",
    )


@pytest.mark.django_db
def test_application_is_created_as_draft(application):
    assert application.status == ApplicationStatus.DRAFT


@pytest.mark.django_db
def test_draft_application_can_be_edited(application):
    validate_can_edit(application)

    application.description = "Updated description."
    application.save()

    application.refresh_from_db()

    assert application.description == "Updated description."


@pytest.mark.django_db
def test_draft_application_can_be_submitted(application):
    submit_application(application)

    application.refresh_from_db()

    assert application.status == ApplicationStatus.SUBMITTED
    assert application.submitted_at is not None


@pytest.mark.django_db
def test_submitted_application_can_start_review(application):
    submit_application(application)
    start_review(application)

    application.refresh_from_db()

    assert application.status == ApplicationStatus.UNDER_REVIEW


@pytest.mark.django_db
def test_under_review_application_can_be_approved(application):
    submit_application(application)
    start_review(application)

    record_reviewer_decision(
        application=application,
        decision=ApplicationStatus.APPROVED,
        reviewer_comment="Application meets all requirements.",
    )

    application.refresh_from_db()

    assert application.status == ApplicationStatus.APPROVED
    assert application.reviewed_at is not None


@pytest.mark.django_db
def test_rejected_decision_requires_comment(application):
    submit_application(application)
    start_review(application)

    with pytest.raises(HttpError):
        record_reviewer_decision(
            application=application,
            decision=ApplicationStatus.REJECTED,
            reviewer_comment="",
        )


@pytest.mark.django_db
def test_need_more_information_decision_requires_comment(application):
    submit_application(application)
    start_review(application)

    with pytest.raises(HttpError):
        record_reviewer_decision(
            application=application,
            decision=ApplicationStatus.NEED_MORE_INFORMATION,
            reviewer_comment="",
        )


@pytest.mark.django_db
def test_approved_application_cannot_be_edited(application):
    submit_application(application)
    start_review(application)

    record_reviewer_decision(
        application=application,
        decision=ApplicationStatus.APPROVED,
        reviewer_comment="Approved.",
    )

    application.refresh_from_db()

    with pytest.raises(HttpError):
        validate_can_edit(application)


@pytest.mark.django_db
def test_rejected_application_cannot_be_edited(application):
    submit_application(application)
    start_review(application)

    record_reviewer_decision(
        application=application,
        decision=ApplicationStatus.REJECTED,
        reviewer_comment="Rejected because requirements were not met.",
    )

    application.refresh_from_db()

    with pytest.raises(HttpError):
        validate_can_edit(application)


@pytest.mark.django_db
def test_need_more_information_application_can_be_edited_and_resubmitted(application):
    submit_application(application)
    start_review(application)

    record_reviewer_decision(
        application=application,
        decision=ApplicationStatus.NEED_MORE_INFORMATION,
        reviewer_comment="Please provide more details.",
    )

    application.refresh_from_db()

    validate_can_edit(application)

    application.description = "Updated with more information."
    application.save()

    submit_application(application)

    application.refresh_from_db()

    assert application.status == ApplicationStatus.SUBMITTED
    assert application.description == "Updated with more information."

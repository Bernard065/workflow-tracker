import pytest
from django.test import Client

from applications.models import Application, ApplicationStatus, ApplicationType


@pytest.fixture
def client():
    return Client()


@pytest.fixture
def application():
    return Application.objects.create(
        tracking_number="APP-2026-API001",
        applicant_name="Jane Doe",
        applicant_email="jane@example.com",
        company_name="Jane Holdings Ltd",
        application_type=ApplicationType.RECORDATION,
        description="API test application.",
    )


@pytest.mark.django_db
def test_create_application_endpoint(client):
    response = client.post(
        "/api/applications",
        data={
            "applicant_name": "John Doe",
            "applicant_email": "john@example.com",
            "company_name": "Doe Holdings Ltd",
            "application_type": "recordation",
            "description": "Application for recordation.",
        },
        content_type="application/json",
    )

    assert response.status_code == 201

    data = response.json()

    assert data["tracking_number"].startswith("APP-")
    assert data["status"] == ApplicationStatus.DRAFT
    assert data["applicant_email"] == "john@example.com"


@pytest.mark.django_db
def test_list_applications_endpoint(client, application):
    response = client.get("/api/applications")

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 1
    assert data[0]["tracking_number"] == application.tracking_number


@pytest.mark.django_db
def test_get_application_detail_endpoint(client, application):
    response = client.get(f"/api/applications/{application.id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(application.id)
    assert data["tracking_number"] == application.tracking_number


@pytest.mark.django_db
def test_update_draft_application_endpoint(client, application):
    response = client.patch(
        f"/api/applications/{application.id}",
        data={
            "description": "Updated from API test.",
        },
        content_type="application/json",
    )

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.description == "Updated from API test."


@pytest.mark.django_db
def test_submit_application_endpoint(client, application):
    response = client.post(f"/api/applications/{application.id}/submit")

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.status == ApplicationStatus.SUBMITTED
    assert application.submitted_at is not None


@pytest.mark.django_db
def test_start_review_endpoint(client, application):
    client.post(f"/api/applications/{application.id}/submit")

    response = client.post(f"/api/applications/{application.id}/start-review")

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.status == ApplicationStatus.UNDER_REVIEW


@pytest.mark.django_db
def test_approve_application_endpoint(client, application):
    client.post(f"/api/applications/{application.id}/submit")
    client.post(f"/api/applications/{application.id}/start-review")

    response = client.post(
        f"/api/applications/{application.id}/decision",
        data={
            "decision": "approved",
            "reviewer_comment": "Application is approved.",
        },
        content_type="application/json",
    )

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.status == ApplicationStatus.APPROVED
    assert application.reviewer_comment == "Application is approved."


@pytest.mark.django_db
def test_reject_without_comment_returns_error(client, application):
    client.post(f"/api/applications/{application.id}/submit")
    client.post(f"/api/applications/{application.id}/start-review")

    response = client.post(
        f"/api/applications/{application.id}/decision",
        data={
            "decision": "rejected",
            "reviewer_comment": "",
        },
        content_type="application/json",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_approved_application_cannot_be_edited_via_api(client, application):
    client.post(f"/api/applications/{application.id}/submit")
    client.post(f"/api/applications/{application.id}/start-review")

    client.post(
        f"/api/applications/{application.id}/decision",
        data={
            "decision": "approved",
            "reviewer_comment": "Approved.",
        },
        content_type="application/json",
    )

    response = client.patch(
        f"/api/applications/{application.id}",
        data={
            "description": "Trying to edit approved application.",
        },
        content_type="application/json",
    )

    assert response.status_code == 400

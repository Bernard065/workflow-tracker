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

    assert data["total"] >= 1
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert data["total_pages"] >= 1
    assert len(data["items"]) >= 1
    assert data["items"][0]["tracking_number"] == application.tracking_number


@pytest.mark.django_db
def test_list_applications_endpoint_supports_pagination(client):
    for index in range(15):
        Application.objects.create(
            tracking_number=f"APP-2026-PAGE{index:03d}",
            applicant_name=f"Applicant {index}",
            applicant_email=f"applicant{index}@example.com",
            company_name=f"Company {index}",
            application_type=ApplicationType.RECORDATION,
            description="Pagination test application.",
        )

    response = client.get("/api/applications?page=2&page_size=5")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 15
    assert data["page"] == 2
    assert data["page_size"] == 5
    assert data["total_pages"] == 3
    assert len(data["items"]) == 5


@pytest.mark.django_db
def test_list_applications_endpoint_supports_search(client):
    Application.objects.create(
        tracking_number="APP-2026-SEARCH001",
        applicant_name="Alice Search",
        applicant_email="alice@example.com",
        company_name="Search Company Ltd",
        application_type=ApplicationType.RECORDATION,
        description="Searchable application.",
    )

    Application.objects.create(
        tracking_number="APP-2026-OTHER001",
        applicant_name="Bob Other",
        applicant_email="bob@example.com",
        company_name="Other Company Ltd",
        application_type=ApplicationType.RENEWAL,
        description="Other application.",
    )

    response = client.get("/api/applications?search=Alice")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["applicant_name"] == "Alice Search"


@pytest.mark.django_db
def test_list_applications_endpoint_supports_status_filter(client):
    draft_application = Application.objects.create(
        tracking_number="APP-2026-DRAFT001",
        applicant_name="Draft User",
        applicant_email="draft@example.com",
        company_name="Draft Company Ltd",
        application_type=ApplicationType.RECORDATION,
        description="Draft application.",
    )

    submitted_application = Application.objects.create(
        tracking_number="APP-2026-SUBMITTED001",
        applicant_name="Submitted User",
        applicant_email="submitted@example.com",
        company_name="Submitted Company Ltd",
        application_type=ApplicationType.RENEWAL,
        description="Submitted application.",
        status=ApplicationStatus.SUBMITTED,
    )

    response = client.get("/api/applications?status=submitted")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["tracking_number"] == submitted_application.tracking_number
    assert data["items"][0]["tracking_number"] != draft_application.tracking_number


@pytest.mark.django_db
def test_list_applications_endpoint_supports_application_type_filter(client):
    Application.objects.create(
        tracking_number="APP-2026-REC001",
        applicant_name="Recordation User",
        applicant_email="recordation@example.com",
        company_name="Recordation Company Ltd",
        application_type=ApplicationType.RECORDATION,
        description="Recordation application.",
    )

    Application.objects.create(
        tracking_number="APP-2026-REN001",
        applicant_name="Renewal User",
        applicant_email="renewal@example.com",
        company_name="Renewal Company Ltd",
        application_type=ApplicationType.RENEWAL,
        description="Renewal application.",
    )

    response = client.get("/api/applications?application_type=renewal")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["application_type"] == ApplicationType.RENEWAL


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
def test_need_more_information_without_comment_returns_error(client, application):
    client.post(f"/api/applications/{application.id}/submit")
    client.post(f"/api/applications/{application.id}/start-review")

    response = client.post(
        f"/api/applications/{application.id}/decision",
        data={
            "decision": "need_more_information",
            "reviewer_comment": "",
        },
        content_type="application/json",
    )

    assert response.status_code == 400


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
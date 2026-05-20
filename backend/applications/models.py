import uuid

from django.db import models


class ApplicationType(models.TextChoices):
    RECORDATION = "recordation", "Recordation"
    RENEWAL = "renewal", "Renewal"
    CHANGE_OF_OWNERSHIP = "change_of_ownership", "Change of Ownership"
    CHANGE_OF_NAME = "change_of_name", "Change of Name"
    DISCONTINUATION = "discontinuation", "Discontinuation"


class ApplicationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    SUBMITTED = "submitted", "Submitted"
    UNDER_REVIEW = "under_review", "Under Review"
    NEED_MORE_INFORMATION = "need_more_information", "Need More Information"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"


class Application(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    tracking_number = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
    )

    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)

    application_type = models.CharField(
        max_length=50,
        choices=ApplicationType.choices,
    )

    description = models.TextField()

    status = models.CharField(
        max_length=50,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
        db_index=True,
    )

    reviewer_comment = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tracking_number} - {self.applicant_name}"

    @property
    def can_edit(self):
        return self.status in [
            ApplicationStatus.DRAFT,
            ApplicationStatus.NEED_MORE_INFORMATION,
        ]

    @property
    def can_submit(self):
        return self.status in [
            ApplicationStatus.DRAFT,
            ApplicationStatus.NEED_MORE_INFORMATION,
        ]

import uuid

from django.utils import timezone


def generate_tracking_number() -> str:
    year = timezone.now().year
    short_id = str(uuid.uuid4()).split("-")[0].upper()

    return f"APP-{year}-{short_id}"

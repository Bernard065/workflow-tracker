from typing import List
from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Application
from .schemas import ApplicationListSchema, ApplicationOutSchema

router = Router(tags=["Applications"])


@router.get("", response=List[ApplicationListSchema])
def list_applications(request):
    return Application.objects.all()


@router.get("/{application_id}", response=ApplicationOutSchema)
def get_application(request, application_id: UUID):
    return get_object_or_404(Application, id=application_id)

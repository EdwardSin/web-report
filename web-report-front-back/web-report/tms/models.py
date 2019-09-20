from django.db import models
from contact.models import Contact
from circuit.models import Circuit
import uuid


class TMS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.GenericIPAddressField()
    port = models.PositiveIntegerField()
    name = models.CharField(max_length=48)
    dailyreporter_version = models.CharField(max_length=24, blank=True)
    tms_version = models.CharField(max_length=24)
    tmsconnect_version = models.CharField(max_length=24, blank=True)
    country = models.CharField(max_length=24, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    circuit_uuid = models.ForeignKey(Circuit, on_delete=models.CASCADE)
    contact_uuid = models.ForeignKey(Contact, on_delete=models.SET_NULL,
                                     null=True)

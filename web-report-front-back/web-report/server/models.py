from django.db import models
from tms.models import TMS
import uuid


class Server(models.Model):
    class Meta:
        unique_together = (('tms_uuid', 'id'),)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=48)
    ip = models.GenericIPAddressField()
    type = models.CharField(max_length=48)
    software = models.CharField(max_length=48, blank=True)
    serial = models.CharField(max_length=48, blank=True)
    data_usage = models.CharField(max_length=24, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tms_uuid = models.ForeignKey(TMS, on_delete=models.CASCADE)

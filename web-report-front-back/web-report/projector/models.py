from django.db import models
from tms.models import TMS
import uuid


class Projector(models.Model):
    class Meta:
        unique_together = (('id', 'tms_uuid'),)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=48)
    serial = models.CharField(max_length=48)
    lamp_usage = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tms_uuid = models.ForeignKey(TMS, on_delete=models.CASCADE)

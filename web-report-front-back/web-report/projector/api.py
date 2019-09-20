from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from projector.models import Projector
from tastypie import fields
from tms.api import TMSResource


class ProjectorResource(ModelResource):
    tms = fields.ToOneField(TMSResource, 'tms_uuid', full=True)

    class Meta:
        queryset = Projector.objects.all()
        resource_name = 'projector'
        authorization = Authorization()
        ordering = ["tms", "type", "serial", "lamp_usage"]

        filtering = {
            "tms": ALL_WITH_RELATIONS,
            "type": ALL
        }

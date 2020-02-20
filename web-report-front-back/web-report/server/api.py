from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from server.models import Server
from tastypie import fields
from tms.api import TMSResource
from circuit.api import CircuitResource


class ServerResource(ModelResource):
    tms = fields.ToOneField(TMSResource, 'tms_uuid', full=True)

    class Meta:
        queryset = Server.objects.all()
        resource_name = 'server'
        authorization = Authorization()
        ordering = ["tms", "tms__circuit", "id", "name", "ip", "type",
                    "serial", "software", "data_usage"]

        filtering = {
            "name": ALL,
            "type": ALL,
            "software": ALL,
            "tms": ALL_WITH_RELATIONS
        }

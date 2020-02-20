
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tms.models import TMS
from tastypie import fields
from circuit.api import CircuitResource
from contact.api import ContactResource


class TMSResource(ModelResource):
    circuit = fields.ToOneField(CircuitResource, 'circuit_uuid', full=True)
    contact_person = fields.ToOneField(ContactResource, 'contact_uuid',
                                       full=True)

    class Meta:
        queryset = TMS.objects.all()

        # resource_name = 'tms'
        authorization = Authorization()
        ordering = ["id", "circuit", "name", "host", "port",
                    "dailyreporter_version",
                    "tms_version", "tmsconnect_version", "country",
                    "contact_person"]
        filtering = {
            "circuit": ALL_WITH_RELATIONS,
            "contact_person": ALL_WITH_RELATIONS,
            "tms_version": ALL,
            "name": ALL
        }


from circuit.models import Circuit
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL


class CircuitResource(ModelResource):
    class Meta:
        queryset = Circuit.objects.all()
        resource_name = 'circuit'
        authorization = Authorization()

        ordering = ["name"]

        filtering = {
            'name': ALL
        }

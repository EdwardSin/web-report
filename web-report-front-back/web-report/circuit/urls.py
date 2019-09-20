
from django.urls import re_path, include
from circuit.api import CircuitResource

circuit_resource = CircuitResource()

urlpatterns = [
    re_path(r'^api/', include(circuit_resource.urls)),
]

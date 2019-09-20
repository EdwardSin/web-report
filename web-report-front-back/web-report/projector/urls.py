
from django.urls import re_path, include
from projector.api import ProjectorResource

projector_resource = ProjectorResource()

urlpatterns = [
    re_path(r'^api/', include(projector_resource.urls)),
]

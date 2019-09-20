
from django.urls import re_path, include
from server.api import ServerResource

server_resource = ServerResource()

urlpatterns = [
    re_path(r'^api/', include(server_resource.urls)),
]

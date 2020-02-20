
from django.urls import re_path, include
from tms.api import TMSResource

tms_resource = TMSResource()

urlpatterns = [
    re_path(r'^api/', include(tms_resource.urls)),
]

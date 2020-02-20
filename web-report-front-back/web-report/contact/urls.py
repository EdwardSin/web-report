
from django.urls import re_path, include
from contact.api import ContactResource

contact_resource = ContactResource()

urlpatterns = [
    re_path(r'^api/', include(contact_resource.urls)),
]

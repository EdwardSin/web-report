from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL
from contact.models import Contact


class ContactResource(ModelResource):
    class Meta:
        queryset = Contact.objects.all()
        resource_name = 'contact'
        authorization = Authorization()
        filtering = {
            'name': ALL
        }

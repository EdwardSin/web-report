from django.shortcuts import render, get_object_or_404

# Create your views here.

import csv
import os
from projector.models import Projector
from tms.models import TMS
from circuit.models import Circuit
from contact.models import Contact
from server.models import Server
import uuid


THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))


def read_csv(file_name, callback=None):
    my_file = os.path.join(THIS_FOLDER, 'csv', file_name)
    with open(my_file) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')

        if callback is not None:
            for i, row in enumerate(csv_reader):
                if i > 0:
                    callback(row)


def callback_run_tms(row):
    contacts = Contact.objects.filter(name=row[9], number=row[10])
    circuits = Circuit.objects.filter(name=row[1])

    if len(contacts) == 0:
        contact = Contact.objects.create(name=row[9], number=row[10])
    if len(circuits) == 0:
        circuit = Circuit.objects.create(name=row[1])

    contact = Contact.objects.get(name=row[9], number=row[10])
    circuit = Circuit.objects.get(name=row[1])

    TMS.objects.create(id=row[0], circuit_uuid=circuit, name=row[2],
                       host=row[3], port=row[4],
                       dailyreporter_version=row[5], tms_version=row[6],
                       tmsconnect_version=row[7], country=row[8],
                       contact_uuid=contact)


def callback_run_projector(row):
    # circuit = Circuit.objects.get(name=row[1])
    # if circuit is None:
    #     circuit = Circuit.objects.create(name=row[1])
    tms = TMS.objects.get(id=row[0])
    Projector.objects.create(type=row[3], serial=row[4],
                             lamp_usage=row[5],
                             tms_uuid=tms)
    pass


def callback_run_server(row):
    tms = TMS.objects.get(id=row[0])
    Server.objects.create(tms_uuid=tms, id=row[3], name=row[4], ip=row[5],
                          type=row[6], serial=row[7], software=row[8],
                          data_usage=row[9])
    pass


# read_csv('tms.csv', callback_run_tms)
# read_csv('projector.csv', callback_run_projector)
# read_csv('server.csv', callback_run_server)

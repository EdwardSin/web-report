# Generated by Django 2.2.5 on 2019-09-13 08:37

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('circuit', '0003_auto_20190913_0837'),
        ('tms', '0002_auto_20190913_0804'),
    ]

    operations = [
        migrations.AddField(
            model_name='tms',
            name='circuit_uuid',
            field=models.ForeignKey(default='',
                                    on_delete=django.db.models.
                                    deletion.CASCADE,
                                    to='circuit.Circuit'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tms',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False,
                                   primary_key=True, serialize=False),
        ),
    ]
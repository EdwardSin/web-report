# Generated by Django 2.2.5 on 2019-09-13 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.CharField(max_length=36, primary_key=True,
                                        serialize=False)),
                ('name', models.CharField(max_length=48)),
                ('number', models.CharField(max_length=24)),
            ],
        ),
    ]

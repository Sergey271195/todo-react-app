# Generated by Django 3.1.1 on 2020-10-09 18:03

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_creator', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailytasklist',
            name='date',
            field=models.DateField(blank=True, default=datetime.datetime.now, unique=True),
        ),
    ]

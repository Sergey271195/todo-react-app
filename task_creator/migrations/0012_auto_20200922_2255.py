# Generated by Django 3.1.1 on 2020-09-22 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_creator', '0011_employee_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='photo',
            field=models.CharField(blank=True, default='https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg', max_length=300, null=True),
        ),
    ]

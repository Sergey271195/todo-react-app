from django.core.management.base import BaseCommand
from task_creator.models import Employee

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        employee = Employee.objects.all()
        for empl in employee:
            print('-------------------')
            print(empl.__dict__)
            print()

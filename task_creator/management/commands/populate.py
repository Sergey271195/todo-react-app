from django.core.management.base import BaseCommand
from task_creator.bitrix24 import BitrixIntegrator
from task_creator.utilities import EmployeeManager

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        bitrix = BitrixIntegrator()
        tskManager = EmployeeManager(bitrix)
        tskManager.check_for_new_emloyee()
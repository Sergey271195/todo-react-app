from django.http import JsonResponse
from .models import Employee, Task, DailyTaskConnector, DailyTaskList
from task_creator.bitrix24 import BitrixIntegrator

import datetime

def not_found_response():
    return JsonResponse({'status': 404})

def success_response():
    return JsonResponse({'status': 200})

class EmployeeManager():

    def __init__(self, bitrix):
        self.bitrix = bitrix
        self.mainemployee = [1, 26, 334, 370, 240, 262, 34, 416, 352, 330]

    def check_for_new_emloyee(self):
        users_list = self.bitrix.get_all_users(["ID", "NAME", "LAST_NAME"])
        for user in users_list:
            id_, first_name, last_name = user
            is_main = False
            db_user = Employee.objects.filter(bitrix_id = int(id_))
            if not db_user:
                if int(id_) in self.mainemployee:
                    is_main = True
                full_name = last_name + " " + first_name
                employee = Employee(bitrix_id = int(id_), first_name = first_name, last_name = last_name, full_name = full_name, is_main = is_main)
                employee.save()
            else:
                full_name = last_name + " " + first_name
                print(db_user.values())

    def delete_employee(self, id_):
        try:
            db_user = Employee.objects.get(bitrix_id = id_)
            db_user.delete()
        except Employee.DoesNotExist:
            print('Employee do not exist')

    def get_all_employee(self):
        all_employee = [[employee.bitrix_id, employee.full_name] for employee in list(Employee.objects.all())]
        return all_employee

    def get_all_employee_id(self):
        all_employee = [employee.bitrix_id for employee in list(Employee.objects.all())]
        return all_employee


    def get_employee(self, username):
        all_employee = Employee.objects.filter(full_name__icontains = username)
        if all_employee:
            return [employee for employee in list(all_employee)]

    def get_employee_by_id(self, id_):
        employee = Employee.objects.get(id = id_)
        return employee

    def get_main(self):
        mainemployee = [1, 26, 334, 370, 240, 262, 34, 416, 352, 330]
        employee = Employee.objects.filter(bitrix_id__in = mainemployee)
        return employee

        

class TaskManager():

    def __init__(self, bitrix):
        self.bitrix = bitrix

    def get_users_tasks(self, id_):
        employee_tasks = self.bitrix.get_all_user_tasks(id_)
        return employee_tasks

    def get_todolist(self):
        try:
            todolist = DailyTaskList.objects.get(date = datetime.date.today())
            return todolist
        except DailyTaskList.DoesNotExist:
            todolist = DailyTaskList(date = datetime.date.today())
            todolist.save()
            return todolist

    def get_daily_tasks(self):
        todolist = self.get_todolist()
        daily_tasks = DailyTaskConnector.objects.filter(task_list = todolist).order_by('employee_id')
        return daily_tasks

    def get_daily_tasks_by_user(self, employee_id):
        todolist = self.get_todolist()
        daily_tasks = DailyTaskConnector.objects.filter(task_list = todolist, employee_id__bitrix_id = employee_id)
        print(daily_tasks)
        return daily_tasks

    def add_task(self, task_id):
        json_task = self.bitrix.get_task(task_id)
        try:
            db_task = Task.objects.get(bitrix_id = json_task.get('id'))
            self.add_task_to_list(db_task)
            print(db_task)
        except Task.DoesNotExist:
            date_created = json_task.get('createdDate').split('T')[0]
            date_created = datetime.datetime.strptime(date_created, r"%Y-%m-%d")
            deadline = json_task.get('deadline')
            creator = Employee.objects.get(bitrix_id = int(json_task.get('createdBy')))
            employee = Employee.objects.get(bitrix_id = int(json_task.get('responsibleId')))
            if deadline:
                deadline = datetime.datetime.strptime(deadline.split('T')[0], r"%Y-%m-%d")
            db_task = Task(bitrix_id = int(json_task.get('id')), title = json_task.get('title'), description = json_task.get('description'),
                            creator_id = creator, employee_id = employee, date_created = date_created, deadline = deadline)
            db_task.save()
            self.add_task_to_list(db_task)
            print(db_task)

    def add_task_to_list(self, task):
        todolist = self.get_todolist()
        connector = DailyTaskConnector(task_list = todolist, task = task)
        connector.save()

    def create_task(self, employee, title):
        fields = {'TITLE': title, 'RESPONSIBLE_ID': employee, 'CREATED_BY': employee, 'STATUS': 3, 'DESCRIPTION': ''}
        new_task = self.bitrix.add_task(fields)
        return new_task

if __name__ == "__main__":
    bitrix = BitrixIntegrator()
    empManager = EmployeeManager(bitrix)
    empManager.check_for_new_emloyee()

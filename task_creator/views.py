from django.shortcuts import render
from django.db.models import F, Max
from django.http import HttpResponse, JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.utils import timezone
import datetime
import json
import os

from .serializers import EmployeeSerializer, TaskSerializer, DailyTaskConnectorSerializer, CommentSerialzier
from .models import Employee, Task, DailyTaskConnector, DailyTaskList, Comment

from .utilities import EmployeeManager, TaskManager, not_found_response, success_response
from task_creator.bitrix24 import BitrixIntegrator



def get_last_task_index(employee_id):
    today = timezone.now().date()
    print( DailyTaskConnector.objects.filter(task_list__date = today))
    last_index = DailyTaskConnector.objects.filter(employee_id__bitrix_id = employee_id, task_list__date = today).aggregate(Max('priority'))
    return last_index['priority__max'] if last_index['priority__max'] else 0


###FOR TEST##########
def sort_priorities(employee_id, old_priority, new_priority):
    updated_task = DailyTaskConnector.objects.get(employee_id__id = employee_id, priority = old_priority)
    if new_priority > old_priority:
        update_values = {
            'range': (old_priority, new_priority),
            'shift': -1
        }
    else:
        update_values = {
            'range': (new_priority, old_priority),
            'shift': 1
        }    
    tasks_to_update = DailyTaskConnector.objects.get(employee_id__id = employee_id,
        priority__range = (update_values.get('range'))).update(priority = F('priority') + update_values.get('shift'))
    updated_task.update(priority = new_priority)
    all_tasks = DailyTaskConnector.objects.filter(employe_id__id = employee_id)
    print(all_tasks)
####################



def createComment(connector, comment):
    new_comment = Comment(task_connector = connector, content = comment)
    new_comment.save()
    return new_comment

def addExistingTask(task):
    try:
        print('Exisiting task')
        responsible = EmployeeSerializer(Employee.objects.get(bitrix_id = int(task.get('responsibleId')))).data
        creator = EmployeeSerializer(Employee.objects.get(bitrix_id = int(task.get('createdBy')))).data
        new_serializer = TaskSerializer(data = {'employee_id': responsible, 'creator_id': creator,
        'bitrix_id': int(task.get('id')), 'title': task.get('title'), 'description': task.get('description', '')})
        if new_serializer.is_valid(raise_exception = True):
            db_task = new_serializer.save()
            return db_task
    except Employee.DoesNotExist:
        return None

def removeTaskFromDailyList(task_id, todolist):
    try:
        db_task = Task.objects.get(bitrix_id = task_id)
        daily_task = DailyTaskConnector.objects.get(task = db_task, task_list = todolist).delete()
    except Exception as e:
        print(e)
        


def addTaskToDailyList(task, todolist, employee_id, priority, comment = None):
    print(priority)
    try:
        connector = DailyTaskConnector.objects.get(task = task, task_list = todolist)
    except DailyTaskConnector.DoesNotExist:
        employee = Employee.objects.get(bitrix_id = employee_id)
        connector = DailyTaskConnector(employee_id = employee, task_list = todolist, task = task, priority = priority)
        print(connector.__dict__)
        connector.save()
        if comment:
            createComment(connector = connector, comment = comment)
        serializer = DailyTaskConnectorSerializer(connector)
        return serializer

@csrf_exempt
def dailyTaskManagerView(request):
    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)
    empManager = EmployeeManager(bitrix)
    daily_tasks = tskManager.get_daily_tasks().order_by('priority')
    serializer = DailyTaskConnectorSerializer(daily_tasks, many = True)
    return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
def commentManagerView(request, pk):
    connector = DailyTaskConnector.objects.get(id = pk)
    request_body = json.loads(request.body)
    comment = request_body.get('comment')
    createComment(connector = connector, comment = comment)
    return success_response()


@csrf_exempt
def addTaskView(request, emplId):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)

    if request.method == 'GET':
        try:
            users_tasks = bitrix.get_all_user_tasks(emplId)
            return JsonResponse(users_tasks, safe = False, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            return not_found_response()

    if request.method == 'POST':
        request_body = json.loads(request.body)
        action = request_body.get('action')
        task_id = int(request_body.get('taskId'))
        if action == 'Remove':
            try:
                todolist = tskManager.get_todolist()
                task_to_remove = DailyTaskConnector.objects.filter(task__bitrix_id = task_id, task_list = todolist)
                task_to_remove.delete()
                return success_response()
            except DailyTaskConnector.DoesNotExist:
                return not_found_response()
        elif action == 'Add':
            try:
                db_task = Task.objects.get(bitrix_id = task_id)
            except Task.DoesNotExist:
                bitrix_response = bitrix.get_task_by_id(task_id)
                task = bitrix_response['result']['task']
                db_task = addExistingTask(task)
            if db_task:
                priority = get_last_task_index(db_task.employee_id.bitrix_id) + 1
                print(priority)
                todolist = tskManager.get_todolist()
                new_task = addTaskToDailyList(task = db_task, todolist = todolist, priority = priority, employee_id = emplId)
                if new_task:
                    new_task.data['status'] = 200
                    return JsonResponse(new_task.data, safe = False, json_dumps_params={'ensure_ascii': False})
        return not_found_response()

@csrf_exempt
def createTaskView(request, emplId):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)

    if request.method == 'POST':
        request_body = json.loads(request.body)
        todolist = tskManager.get_todolist()
        print(request_body)
        bitrix_response = tskManager.create_task(employee = emplId, title = request_body.get('title'))
        
        task = bitrix_response['result']['task']
        db_task = addExistingTask(task)
        if db_task:
            todolist = tskManager.get_todolist()
            priority = get_last_task_index(emplId) + 1
            new_task = addTaskToDailyList(task = db_task, todolist = todolist, employee_id = emplId, priority = priority, comment = request_body.get('comment'))
            if new_task:
                new_task.data['status'] = 200
                return JsonResponse(new_task.data, safe = False, json_dumps_params={'ensure_ascii': False})

        return not_found_response()


@csrf_exempt
def completeTaskView(request, pk):
    try:
        db_task = DailyTaskConnector.objects.get(id = pk)
        db_task.completed = not db_task.completed
        db_task.save()
        return success_response()
    except Exception as e:
        return not_found_response()


@csrf_exempt
def userManagerView(request):
    
    if request.method == 'GET':
        if os.environ.get('DEBUG') == 'True':
            employees = Employee.objects.all()
        else:
            employees = Employee.objects.filter(is_main = True)
        serialzer = EmployeeSerializer(employees, many = True)
        return JsonResponse(serialzer.data, safe = False, json_dumps_params={'ensure_ascii': False})

    ####### FOR TEST IN FUTURE #############
    if request.method == 'POST':
        data = request.POST.get('data')
        createUser(data = data)

    if request.method == 'PUT':
        pass

    if request.method == 'DELETE':
        pass

    #######################################


@csrf_exempt
def shiftTasksView(request):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)
        

    if request.method == 'POST':
        request_body = json.loads(request.body)
        todolist = tskManager.get_todolist()
        for user in request_body:
            for index, task in enumerate(request_body[user]):
                DailyTaskConnector.objects.filter(task_list= todolist, task__bitrix_id = int(task['taskId'])).update(priority = index + 1)
        return success_response()


def createUser(data):
    serializer = EmployeeSerializer(data = data)
    if serializer.is_valid():
        try:
            employee = Employee.objects.get(bitrix_id = serializer.data.get('bitrix_id'))
        except Employee.DoesNotExist:
            serializer.save()

def updateUser(instance, data):
    serializer = EmployeeSerializer(instance, data = data, partial = True)
    if serializer.is_valid():
        serializer.save()
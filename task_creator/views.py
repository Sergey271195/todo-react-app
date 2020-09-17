from django.shortcuts import render
from django.db.models import F, Func
from django.http import HttpResponse, JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.utils import timezone
import datetime
import json

from .serializers import EmployeeSerializer, TaskSerializer, DailyTaskConnectorSerializer, CommentSerialzier
from .models import Employee, Task, DailyTaskConnector, DailyTaskList, Comment

from .utilities import EmployeeManager, TaskManager
from task_creator.bitrix24 import BitrixIntegrator

def createComment(connector, comment):
    new_comment = Comment(task_connector = connector, content = comment)
    new_comment.save()
    return new_comment

def addExistingTask(task):
    try:
        responsible = EmployeeSerializer(Employee.objects.get(bitrix_id = int(task.get('responsibleId')))).data
        creator = EmployeeSerializer(Employee.objects.get(bitrix_id = int(task.get('createdBy')))).data
        new_serializer = TaskSerializer(data = {'employee_id': responsible, 'creator_id': creator,
        'bitrix_id': int(task.get('id')), 'title': task.get('title'), 'description': task.get('description')})
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
        


def addTaskToDailyList(task, todolist, employee_id, comment = None):
    try:
        connector = DailyTaskConnector.objects.get(task = task, task_list = todolist)
    except DailyTaskConnector.DoesNotExist:
        employee = Employee.objects.get(bitrix_id = employee_id)
        connector = DailyTaskConnector(employee_id = employee, task_list = todolist, task = task)
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
    daily_tasks = tskManager.get_daily_tasks()
    serializer = DailyTaskConnectorSerializer(daily_tasks, many = True)
    return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
def commentManagerView(request, pk):
    connector = DailyTaskConnector.objects.get(id = pk)
    request_body = json.loads(request.body)
    comment = request_body.get('comment')
    createComment(connector = connector, comment = comment)
    return JsonResponse({'status_code': 200})


@csrf_exempt
def taskManagerView(request, pk):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)

    if request.method == 'GET':
        users_tasks = bitrix.get_all_user_tasks(pk)
        return JsonResponse(users_tasks, safe = False, json_dumps_params={'ensure_ascii': False})

    if request.method == 'POST':
        request_body = json.loads(request.body)
        employee_id = pk
        comment = request_body.get('comment')
        action = request_body.get('action')
        task_id = int(request_body.get('taskId'))
        if action == 'Add':
            try:
                db_task = Task.objects.get(bitrix_id = task_id)
            except Task.DoesNotExist:
                bitrix_response = bitrix.get_task_by_id(task_id)
                task = bitrix_response['result']['task']
                db_task = addExistingTask(task)
        elif action == 'Create':
            bitrix_response = tskManager.create_task(employee = employee_id, title = request_body.get('title'))
            task = bitrix_response['result']['task']
            db_task = addExistingTask(task)
        if db_task:
            todolist = tskManager.get_todolist()
            new_task = addTaskToDailyList(task = db_task, todolist = todolist, employee_id = employee_id, comment = comment)
            if new_task:
                return JsonResponse(new_task.data, safe = False, json_dumps_params={'ensure_ascii': False})

        return JsonResponse({'task': 404})


@csrf_exempt
def completeTaskView(request, pk):
    try:
        db_task = DailyTaskConnector.objects.get(id = pk)
        db_task.completed = not db_task.completed
        db_task.save()
        return JsonResponse({'status': 200})
    except Exception as e:
        return JsonResponse({'status': 400})


@csrf_exempt
def userManagerView(request):
    
    if request.method == 'GET':
        employees = Employee.objects.all()
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
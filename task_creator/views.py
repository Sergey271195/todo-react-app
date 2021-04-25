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
from .models import Employee, Task, DailyTaskConnector, DailyTaskList, Comment, AuthModel

from .utilities import EmployeeManager, TaskManager, not_found_response, success_response
from task_creator.bitrix24 import BitrixIntegrator
from .time_tracker import endView


### Проверка ключа при добавлении задачи/комментария в битрикс
### Если ключ существует - True - Действие в битрикс API осуществляется указанным ключом
### Если ключа нет - действие запрещено

def check_bitrix_token(token):
    al = AuthModel.objects.all()
    print('auth')
    for a in al:
        
        print(a.__dict__)
    try:
        AuthModel.objects.get(bitrix_token = token)
        return True
    except AuthModel.DoesNotExist:
        return False


### Получение индекса (приоритета) новой задачи = число добавленных задач + 1

def get_last_task_index(employee_id):
    today = timezone.now().date()
    last_index = DailyTaskConnector.objects.filter(employee_id__bitrix_id = employee_id, task_list__date = today).aggregate(Max('priority'))
    return last_index['priority__max'] if last_index['priority__max'] else 0

### Изменение приориета задач

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

def createComment(connector, comment, token):
    user = AuthModel.objects.get(bitrix_token = token).user
    bitrix = BitrixIntegrator(token)
    task = Task.objects.get(id = connector.task_id)
    task_id = task.bitrix_id
    new_comment = Comment(task_connector = connector, content = comment, creator = user)
    new_comment.save()
    if task_id != -1:
        bitrix.add_comment(task_id = task_id, comment = comment)
    return new_comment

def addExistingTask(task):
    try:
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
        


def addTaskToDailyList(task, todolist, employee_id, priority, comment = None, token = None):
    try:
        connector = DailyTaskConnector.objects.get(task = task, task_list = todolist)
    except DailyTaskConnector.DoesNotExist:
        employee = Employee.objects.get(bitrix_id = employee_id)
        connector = DailyTaskConnector(employee_id = employee, task_list = todolist, task = task, priority = priority)
        connector.save()
        if comment and token:
            createComment(connector = connector, comment = comment, token = token)
        serializer = DailyTaskConnectorSerializer(connector)
        return serializer

@csrf_exempt
def dailyTaskManagerView(request, date):
    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)
    empManager = EmployeeManager(bitrix)
    curr_tasks = tskManager.get_todolist()
    daily_tasks = tskManager.get_daily_tasks(date)
    if daily_tasks:
        serializer = DailyTaskConnectorSerializer(daily_tasks, many = True)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    return not_found_response()

@csrf_exempt
def commentManagerView(request, pk):
    token = request.headers.get('Authorization').replace('Token ', '')
    if check_bitrix_token(token):
        connector = DailyTaskConnector.objects.get(id = pk)
        request_body = json.loads(request.body)
        comment = request_body.get('comment')
        createComment(connector = connector, comment = comment, token = token)
        return success_response()
    return not_found_response()


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
                todolist = tskManager.get_todolist()
                new_task = addTaskToDailyList(task = db_task, todolist = todolist, priority = priority, employee_id = emplId)
                if new_task:
                    new_task.data['status'] = 200
                    return JsonResponse(new_task.data, safe = False, json_dumps_params={'ensure_ascii': False})
        return not_found_response()

@csrf_exempt
def createTaskView(request, emplId):

    if request.method == 'POST':
        
        request_body = json.loads(request.body)
        token = request.headers.get('Authorization').replace('Token ', '')
        if check_bitrix_token(token):
            bitrix = BitrixIntegrator(token)
            tskManager = TaskManager(bitrix)
            if emplId in [26, 334]:
                employee = Employee.objects.get(bitrix_id = emplId)
                db_task = Task(employee_id = employee, creator_id = employee, bitrix_id = -1, title = request_body.get('title'), description = '')
                db_task.save()
            else:
                bitrix_response = tskManager.create_task(employee = emplId, title = request_body.get('title'), groupId = request_body.get("groupId"))
                task = bitrix_response['result']['task']
                db_task = addExistingTask(task)
            if db_task:
                todolist = tskManager.get_todolist()
                priority = get_last_task_index(emplId) + 1
                new_task = addTaskToDailyList(task = db_task, todolist = todolist, employee_id = emplId,
                    priority = priority, comment = request_body.get('comment'), token = token)
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
        if (db_task.active):
            serializer = DailyTaskConnectorSerializer(db_task)
            task_id = serializer.data['task']['bitrix_id']
            user_id = db_task.employee_id.bitrix_id
            return endView(None, task_id = task_id, user_id = user_id)
        return success_response()
    except Exception as e:
        print(e)
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


def getActiveGroupsForTaskCreation(request):
    if request.method == 'GET':
        #request_body = json.loads(request.body)
        #token = request.headers.get('Authorization').replace('Token ', '')
        #if check_bitrix_token(token):
        bitrix = BitrixIntegrator(""" token """)
        try:
            active_groups = bitrix.get_active_groups()
            return JsonResponse(active_groups, safe = False, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            print(e)
            return not_found_response()
        return not_found_response()



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
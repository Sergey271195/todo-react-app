from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import datetime

from .serializers import EmployeeSerializer, TaskSerializer, DailyTaskConnectorSerializer, CommentSerialzier, TimeTrackerSerializer
from .models import Employee, Task, DailyTaskConnector, DailyTaskList, Comment

from .utilities import TaskManager, not_found_response, success_response
from task_creator.bitrix24 import BitrixIntegrator


@csrf_exempt
def startView(request, user_id, task_id):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)

    try:
        todolist = tskManager.get_todolist()
        task = DailyTaskConnector.objects.get(task__bitrix_id = task_id, task_list = todolist)
        task.starting_time = timezone.localtime(timezone.now())
        task.active = True
        task.save()
        serializer = TimeTrackerSerializer(task)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except DailyTaskConnector.DoesNotExist:
        return not_found_response()


@csrf_exempt
def endView(request, task_id, user_id):

    bitrix = BitrixIntegrator()
    tskManager = TaskManager(bitrix)

    try:
        todolist = tskManager.get_todolist()
        task = DailyTaskConnector.objects.get(task__bitrix_id = task_id, task_list = todolist)
        delta_time = (timezone.localtime(timezone.now()) - task.starting_time).total_seconds()
        bitrix.save_time_to_bitrix(user_id, task_id, timezone.localtime(task.starting_time), delta_time)
        task.total_time += delta_time
        task.active = False
        task.save()
        serializer = TimeTrackerSerializer(task)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except DailyTaskConnector.DoesNotExist:
        return not_found_response()

def test_view(request, data):
    return JsonResponse({'status': 200})
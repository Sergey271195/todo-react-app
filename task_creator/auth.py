from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.utils import IntegrityError

from .serializers import EmployeeSerializer, AuthModelSerializer, UserSerializer
from .models import Employee, AuthModel

from .utilities import TaskManager, not_found_response, success_response
from task_creator.bitrix24 import BitrixIntegrator

import json


@csrf_exempt
def registerView(request):
    if request.method == 'POST':
        request_body = json.loads(request.body)
        bitrix_key = request_body.get('bitrix_key')
        if bitrix_key[-1] == '/':
            bitrix_key = bitrix_key[:-1]
        bitrix = BitrixIntegrator()
        bitrix_id = bitrix.check_key(bitrix_key)
        if bitrix_id:
            try:
                authmodel = AuthModel.objects.get(employee__bitrix_id = bitrix_id)
                return JsonResponse({'STATUS_CODE': 500, 'MESSAGE': 'THE KEY FOR THIS BITRIX EMPLOYEE ALREADY EXISTS'})
            except AuthModel.DoesNotExist:
                try:
                    user = User.objects.create_user(username = request_body.get('username'), password = request_body.get('password'),
                    first_name = request_body.get('firstname'), last_name = request_body.get('lastname'))
                    employee = Employee.objects.get(bitrix_id = bitrix_id)
                    authmodel = AuthModel(user = user, employee = employee, bitrix_token = bitrix_key, is_admin = False)
                    authmodel.save()
                    serializer = AuthModelSerializer(authmodel)
                    return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
                except IntegrityError:
                    return JsonResponse({'STATUS_CODE': 500, 'MESSAGE': 'THIS USERNAME ALREADY EXISTS'})
        return JsonResponse({'STATUS_CODE': 500, 'MESSAGE': 'INVALID BITRIX KEY'})

@csrf_exempt
def loginView(request):

    if request.method == 'GET':
        print(request.headers.get('Authorization'))
        return success_response()

    if request.method == 'POST':
        print(request.headers)
        request_body = json.loads(request.body)
        db_user = authenticate(username = request_body.get('username'), password = request_body.get('password'))
        if db_user:
            authmodel = AuthModel.objects.get(user = db_user)
            serializer = AuthModelSerializer(authmodel)
            return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
        return JsonResponse({'STATUS_CODE': 500, 'MESSAGE': 'INVALID CREDENTIALS'})

@csrf_exempt
def logoutView(request):

    if request.method == 'POST':
        request_body = json.loads(request.body)
        print(request_body)

    return success_response()
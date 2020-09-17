from .models import Employee, Task, Comment, DailyTaskConnector, DailyTaskList
from django.utils import timezone
from rest_framework import serializers

import datetime

class EmployeeSerializer(serializers.Serializer):
    bitrix_id = serializers.IntegerField()
    first_name = serializers.CharField(max_length = 50)
    last_name = serializers.CharField(max_length = 50)
    full_name = serializers.CharField(max_length = 50)
    is_main = serializers.BooleanField(default = False)

    def create(self, vaildated_data):
        employee = Employee(**vaildated_data)
        employee.save()
        return employee

    def update(self, instance, vaildated_data):
        instance.is_main = vaildated_data.get('is_main', instance.is_main)
        instance.save()
        return instance

class TaskSerializer(serializers.Serializer):

    employee_id = EmployeeSerializer()
    creator_id = EmployeeSerializer()
    bitrix_id = serializers.IntegerField()
    title = serializers.CharField(max_length = 100)
    description = serializers.CharField(required=False, allow_blank = True)
    date_updated = serializers.DateTimeField(required=False)

    def create(self, vaildated_data):
        employee = vaildated_data.pop('employee_id')['bitrix_id']
        db_employee = Employee.objects.get(bitrix_id = employee)
        creator = vaildated_data.pop('creator_id')['bitrix_id']
        db_creator = Employee.objects.get(bitrix_id = creator)
        task = Task(employee_id = db_employee, creator_id = db_creator, date_updated = datetime.datetime.now(), **vaildated_data)
        task.save()
        return task

    def update(self, instance, vaildated_data):
        instance.date_updated = datetime.datetime.now()
        instance.save()
        return instance

class DailyTaskListSerializer(serializers.Serializer):

    date = serializers.DateField(required = False)

class DailyTaskConnectorSerializer(serializers.Serializer):

    pk = serializers.IntegerField(read_only = True)
    employee_id = EmployeeSerializer()
    task_list = DailyTaskListSerializer()
    task = TaskSerializer()
    comments = serializers.SerializerMethodField()
    completed = serializers.BooleanField()

    def get_comments(self, obj):
        comments = Comment.objects.filter(task_connector = obj)
        serializer = CommentSerialzier(comments, many = True)
        return serializer.data


class CommentSerialzier(serializers.Serializer):

    content = serializers.CharField()

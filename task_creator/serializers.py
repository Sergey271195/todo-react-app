from .models import Employee, Task, Comment, DailyTaskConnector, DailyTaskList, AuthModel
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth.models import User
import datetime

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']

class EmployeeSerializer(serializers.Serializer):
    bitrix_id = serializers.IntegerField()
    first_name = serializers.CharField(max_length = 50)
    last_name = serializers.CharField(max_length = 50)
    full_name = serializers.CharField(max_length = 50)
    is_main = serializers.BooleanField(default = False)
    photo = serializers.CharField(max_length = 300)

    def create(self, vaildated_data):
        employee = Employee(**vaildated_data)
        employee.save()
        return employee

    def update(self, instance, vaildated_data):
        instance.is_main = vaildated_data.get('is_main', instance.is_main)
        instance.save()
        return instance

class AuthModelSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = AuthModel
        fields = '__all__'

class TaskSerializer(serializers.Serializer):

    employee_id = EmployeeSerializer()
    creator_id = EmployeeSerializer()
    bitrix_id = serializers.IntegerField()
    title = serializers.CharField(max_length = 100)
    description = serializers.CharField(required=False, allow_blank = True, allow_null = True)
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
    priority = serializers.IntegerField()
    comments = serializers.SerializerMethodField()
    completed = serializers.BooleanField()
    active = serializers.BooleanField()
    starting_time = serializers.DateTimeField()
    ending_time = serializers.DateTimeField()
    total_time = serializers.IntegerField()

    def get_comments(self, obj):
        comments = Comment.objects.filter(task_connector = obj)
        serializer = CommentSerialzier(comments, many = True)
        return serializer.data


class TimeTrackerSerializer(serializers.Serializer):
    
    pk = serializers.IntegerField(read_only = True)
    completed = serializers.BooleanField()
    active = serializers.BooleanField()
    starting_time = serializers.DateTimeField()
    ending_time = serializers.DateTimeField()
    total_time = serializers.IntegerField()

class CommentSerialzier(serializers.Serializer):

    content = serializers.CharField()

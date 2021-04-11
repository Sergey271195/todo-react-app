from django.db import models
from django.contrib.auth.models import User
import datetime

class Employee(models.Model):
    bitrix_id = models.IntegerField(unique = True)
    first_name = models.CharField(max_length = 50)
    last_name = models.CharField(max_length = 50)
    full_name = models.CharField(max_length = 50)
    is_main = models.BooleanField(default = False)
    photo = models.CharField(max_length = 300, default = "https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg", blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} - {self.bitrix_id} - {self.is_main}"    

class AuthModel(models.Model):
    employee = models.ForeignKey(Employee, related_name = 'auth', on_delete = models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default = False)
    bitrix_token = models.CharField(max_length = 200, null = True, blank = True)

    def __str__(self):
        return f"{self.employee[full_name]} - {self.employee[bitrix_id]}" 

class Task(models.Model):
    employee_id = models.ForeignKey(Employee, related_name='employee', on_delete=models.CASCADE)
    creator_id = models.ForeignKey(Employee, related_name='creator', on_delete=models.CASCADE)
    bitrix_id = models.IntegerField()
    title = models.CharField(max_length = 100)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    deadline = models.DateField(blank = True, null = True)

    def __str__(self):
        return f"Bitrix_id:{self.bitrix_id} - {self.title}. Creator: {creator_id}. Employee: {employee_id}" 

class DailyTaskList(models.Model):
    date = models.DateField(default = datetime.datetime.now, blank = True, unique = True)

class DailyTaskConnector(models.Model):
    employee_id = models.ForeignKey(Employee, on_delete = models.CASCADE)
    task_list = models.ForeignKey(DailyTaskList, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    priority = models.IntegerField(default = 0)
    completed = models.BooleanField(default = False)
    active = models.BooleanField(default=False)
    starting_time = models.DateTimeField(blank = True, null = True)
    ending_time = models.DateTimeField(blank = True, null = True)
    total_time = models.IntegerField(default = 0)

class Comment(models.Model):
    
    task_connector = models.ForeignKey(DailyTaskConnector, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete= models.CASCADE, blank = True, null = True)
    content = models.TextField()



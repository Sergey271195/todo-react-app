from django.contrib import admin
from .models import Employee, Task, DailyTaskList, DailyTaskConnector, Comment
# Register your models here.

admin.site.register(Employee)
admin.site.register(Task)
admin.site.register(DailyTaskConnector)
admin.site.register(DailyTaskList)
admin.site.register(Comment)

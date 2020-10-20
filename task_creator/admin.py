from django.contrib import admin
from .models import Employee, Task, DailyTaskList, DailyTaskConnector, Comment, AuthModel
# Register your models here.

admin.site.register(Employee)
admin.site.register(Task)
admin.site.register(DailyTaskConnector)
admin.site.register(DailyTaskList)
admin.site.register(Comment)
admin.site.register(AuthModel)
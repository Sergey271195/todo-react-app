from django.urls import path, include
from .views import userManagerView, taskManagerView, dailyTaskManagerView, commentManagerView, completeTaskView
from .utilities import EmployeeManager
from task_creator.bitrix24 import BitrixIntegrator

bitrix = BitrixIntegrator()
tskManager = EmployeeManager(bitrix)
tskManager.check_for_new_emloyee()


urlpatterns = [
    path('users/', userManagerView),
    path('daily/', dailyTaskManagerView),
    path('tasks/user<int:pk>', taskManagerView),
    path('tasks/comment<int:pk>', commentManagerView),
    path('tasks/complete<int:pk>', completeTaskView)
]
from django.urls import path, include
from .views import userManagerView, addTaskView, dailyTaskManagerView, commentManagerView, completeTaskView, createTaskView, shiftTasksView
from .utilities import EmployeeManager
from task_creator.bitrix24 import BitrixIntegrator

bitrix = BitrixIntegrator()
tskManager = EmployeeManager(bitrix)
tskManager.check_for_new_emloyee()


urlpatterns = [
    path('users/', userManagerView),
    path('daily/', dailyTaskManagerView),
    path('tasks/user<int:emplId>', addTaskView),
    path('tasks/comment<int:pk>', commentManagerView),
    path('tasks/complete<int:pk>', completeTaskView),
    path('tasks/create<int:emplId>', createTaskView),
    path('tasks/shift', shiftTasksView)
]
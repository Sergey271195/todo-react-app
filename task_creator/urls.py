from django.urls import path, include
from .views import userManagerView, taskManagerView, dailyTaskManagerView, commentManagerView, completeTaskView

urlpatterns = [
    path('users/', userManagerView),
    path('daily/', dailyTaskManagerView),
    path('tasks/user<int:pk>', taskManagerView),
    path('tasks/comment<int:pk>', commentManagerView),
    path('tasks/complete<int:pk>', completeTaskView)
]
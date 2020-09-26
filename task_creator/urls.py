from django.urls import path, include
from .views import (userManagerView, addTaskView, dailyTaskManagerView,
                    commentManagerView, completeTaskView,
                    createTaskView, shiftTasksView)
from .time_tracker import startView, endView


urlpatterns = [
    path('users/', userManagerView),
    path('daily<str:date>/', dailyTaskManagerView),
    path('tasks/user<int:emplId>', addTaskView),
    path('tasks/comment<int:pk>', commentManagerView),
    path('tasks/complete<int:pk>', completeTaskView),
    path('tasks/create<int:emplId>', createTaskView),
    path('tasks/shift', shiftTasksView),
    path('time/start&user<int:user_id>&task<int:task_id>', startView),
    path('time/end&user<int:user_id>&task<int:task_id>', endView)
]
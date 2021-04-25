from django.urls import path, include
from .views import (userManagerView, addTaskView, dailyTaskManagerView,
                    commentManagerView, completeTaskView,
                    createTaskView, shiftTasksView, getActiveGroupsForTaskCreation,
                    getListOfGroupTasks)
from .time_tracker import startView, endView
from .auth import loginView, registerView


urlpatterns = [
    path('users/', userManagerView),
    path('daily<str:date>/', dailyTaskManagerView),

    ### Tasks views
    path('tasks/user<int:emplId>', addTaskView),
    path('tasks/comment<int:pk>', commentManagerView),
    path('tasks/complete<int:pk>', completeTaskView),
    path('tasks/create<int:emplId>', createTaskView),
    path('tasks/shift', shiftTasksView),
    path('tasks/groups', getActiveGroupsForTaskCreation),
    path('tasks/groups/<int:pk>', getListOfGroupTasks),

    ### Time views
    path('time/start&user<int:user_id>&task<int:task_id>', startView),
    path('time/end&user<int:user_id>&task<int:task_id>', endView),

    ### Auth views
    path('auth/login', loginView),
    path('auth/register', registerView),
]
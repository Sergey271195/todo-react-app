from django.urls import path, re_path
from .views import index, task_admin


urlpatterns = [
    path('', index),
    path('taskadmin/', task_admin)
]
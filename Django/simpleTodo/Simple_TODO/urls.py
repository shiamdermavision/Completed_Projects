"""
URL configuration for Simple_TODO project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.http import HttpResponse

def home(request):
    return HttpResponse('<a href="http://127.0.0.1:8000/todo/">todo</a>')




from django.contrib import admin
from django.urls import path
from todo import views

urlpatterns = [
    path('', home, name='home'),
    path('todo/', views.todo_list, name='todo_list'),
    path('todo/create', views.create_todo, name='create_todo'),
    path('todo/complate/<int:todo_id>', views.complete_todo, name='complete_todo'),
    path('todo/incomplate/<int:todo_id>', views.incomplete_todo, name='incomplete_todo'),
    path('todo/delete/<int:todo_id>', views.delete_todo, name='delete_todo'),
    path('admin/', admin.site.urls),
]

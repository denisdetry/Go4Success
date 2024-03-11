from django.urls import path

from . import views

urlpatterns = [
    path('addworkshop', views.addworkshop, name='index'),
]
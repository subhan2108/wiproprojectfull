from django.urls import path
from .views import *

urlpatterns = [
    path("my/", MyNotificationsView.as_view()),
    path("admin/send/", AdminSendNotificationView.as_view()),
]

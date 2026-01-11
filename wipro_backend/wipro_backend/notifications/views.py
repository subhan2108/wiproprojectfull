from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Notification
from .services import send_notification


class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Notification.objects.filter(user=request.user)
        return Response([
            {
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "read": n.is_read
            }
            for n in qs
        ])


class AdminSendNotificationView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        send_notification(
            user_id=request.data["user_id"],
            title=request.data["title"],
            message=request.data["message"],
            type=request.data.get("type", "info"),
        )
        return Response({"message": "Sent"})

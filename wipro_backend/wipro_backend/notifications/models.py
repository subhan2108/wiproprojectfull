from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    TYPE = [
        ("success", "Success"),
        ("warning", "Warning"),
        ("error", "Error"),
        ("info", "Info"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="system_notifications"
)


    title = models.CharField(max_length=120)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE, default="info")

    sender = models.CharField(max_length=50, default="Team WIPO")
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

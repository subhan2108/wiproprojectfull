from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "type", "sender", "created_at")
    list_filter = ("type", "sender")
    search_fields = ("user__username", "title")

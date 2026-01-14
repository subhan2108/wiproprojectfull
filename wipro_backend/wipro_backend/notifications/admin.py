from django.contrib import admin
from .models import *

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("user__username", "title")




# notifications/admin.py
from django.contrib import admin
from .models import DueNotification

@admin.register(DueNotification)
class DueNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "committee",
        "plan",
        "amount",
        "repeat_after_minutes",
        "is_active",
        "last_notified_at",
    )

    list_filter = ("is_active", "committee")
    search_fields = ("user__username",)

    fieldsets = (
        ("Target", {
            "fields": ("user", "committee", "plan")
        }),
        ("Payment Due", {
            "fields": ("amount", "repeat_after_minutes")
        }),
        ("Status", {
            "fields": ("is_active", "last_notified_at")
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.user_committee:
            from committees.models import UserCommittee
            uc = UserCommittee.objects.filter(
                user=obj.user,
                committee=obj.committee
            ).first()

            if not uc:
                raise ValueError(
                    "User is not enrolled in this committee"
                )

            obj.user_committee = uc

        super().save_model(request, obj, form, change)




# notifications/admin.py
from django.contrib import admin
from .models import DueResponse

@admin.register(DueResponse)
class DueResponseAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "committee",
        "plan",
        "action",
        "created_at",
    )

    list_filter = ("action", "committee")
    search_fields = ("user__username",)



# notifications/admin.py

@admin.register(CommitteePaymentDue)
class CommitteePaymentDueAdmin(admin.ModelAdmin):
    list_display = (
        "committee",
        "plan",
        "amount",
        "repeat_after_minutes",
        "is_active",
        "created_at",
    )

    list_filter = ("committee", "plan", "is_active")

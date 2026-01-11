from django.contrib import admin

# Register your models here.
from django.contrib import admin



from committees.services.roi_service import calculate_total_return
from .models import *


@admin.register(UserCommittee)
class UserCommitteeAdmin(admin.ModelAdmin):
    list_display = ("user", "committee", "roi_info")

    def roi_info(self, obj):
        data = calculate_total_return(obj)
        return f"₹{data['roi']} (Total: ₹{data['total_return']})"




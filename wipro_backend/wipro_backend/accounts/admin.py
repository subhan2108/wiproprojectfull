from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User
from django.contrib import admin

admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_active")
    actions = ["block_users", "unblock_users"]

    def block_users(self, request, queryset):
        queryset.update(is_active=False)

    def unblock_users(self, request, queryset):
        queryset.update(is_active=True)

from django.contrib import admin
from .models import *
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





from django.contrib import admin
from .models import UserVerification


@admin.register(UserVerification)
class UserVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "email",
        "phone_number",
        "aadhar_number",
        "pan_number",
        "status",
        "created_at",
    )

    list_filter = ("status", "created_at")
    search_fields = (
        "user__username",
        "email",
        "phone_number",
        "aadhar_number",
        "pan_number",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "aadhar_front_preview",
        "pan_card_preview",
    )

    fieldsets = (
        ("User Info", {
            "fields": ("user", "email", "phone_number", "referred_by")
        }),
        ("KYC Details", {
            "fields": ("aadhar_number", "pan_number")
        }),
        ("Uploaded Documents", {
            "fields": (
                "aadhar_front_photo",
                "aadhar_front_preview",
                "pan_card_photo",
                "pan_card_preview",
            )
        }),
        ("Verification Status", {
            "fields": ("status",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    def aadhar_front_preview(self, obj):
        if obj.aadhar_front_photo:
            return f'<img src="{obj.aadhar_front_photo.url}" width="200" />'
        return "No Image"

    def pan_card_preview(self, obj):
        if obj.pan_card_photo:
            return f'<img src="{obj.pan_card_photo.url}" width="200" />'
        return "No Image"

    aadhar_front_preview.allow_tags = True
    pan_card_preview.allow_tags = True

    aadhar_front_preview.short_description = "Aadhar Front Preview"
    pan_card_preview.short_description = "PAN Card Preview"






@admin.register(ReferralLeaderboard)
class ReferralLeaderboardAdmin(admin.ModelAdmin):
    list_display = (
        "rank",
        "user",
        "period",
        "total_referrals",
        "total_earnings",
        "updated_at",
    )

    list_filter = ("period",)
    ordering = ("period", "rank")
    search_fields = ("user__username",)

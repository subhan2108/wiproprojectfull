from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Wallet, WalletTransaction


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "status", "updated_at")
    search_fields = ("user__username",)
    list_filter = ("status",)
    actions = ["freeze_wallet", "unfreeze_wallet"]


    def freeze_wallet(self, request, queryset):
        queryset.update(status="frozen")

    def unfreeze_wallet(self, request, queryset):
        queryset.update(status="active")


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ("wallet", "tx_type", "amount", "source", "status", "created_at")
    list_filter = ("tx_type", "source", "status")
    search_fields = ("wallet__user__username",)





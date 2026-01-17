from django.contrib import admin
from django.utils import timezone

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




from django.contrib import admin
from .models import PaymentMethod, PaymentTransaction


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "method_type",
        "for_investment",
        "for_withdrawal",
        "is_active",
    )
    list_filter = ("method_type", "for_investment", "for_withdrawal", "is_active")
    search_fields = ("name", "upi_id", "account_number")


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "user_committee",
        "transaction_type",
        "amount",
        "payment_method",
        "status",
        "created_at",
    )
    list_filter = ("transaction_type", "status", "payment_method")
    search_fields = ("user__username", "reference_id")
    readonly_fields = ("processed_at", "created_at")

    actions = ["approve_payment", "reject_payment"]

    def approve_payment(self, request, queryset):
        for tx in queryset.filter(status="pending"):
            if tx.amount:
                uc = tx.user_committee
                 # ✅ UPDATE INVESTMENT
            uc.total_invested += tx.amount
            uc.save()

            tx.status = "approved"
            tx.processed_at = timezone.now()
            tx.save()

    approve_payment.short_description = "Approve payment"

    def save_model(self, request, obj, form, change):
        if (
            change
            and obj.status == "approved"
            and obj.processed_at is None
            and obj.amount
        ):
            uc = obj.user_committee
            uc.total_invested += obj.amount
            uc.save()

            obj.processed_at = timezone.now()

        super().save_model(request, obj, form, change)

    def reject_payment(self, request, queryset):
        queryset.update(
            status="rejected",
            processed_at=timezone.now()
        )

    reject_payment.short_description = "Reject payment"



# @admin.register(PaymentTransaction)
# class PaymentTransactionAdmin(admin.ModelAdmin):
#     list_display = (
#         "user",
#         "context",          # ✅ NEW
#         "amount",
#         "payment_method",
#         "status",
#         "due_at",
#         "created_at",
#     )

#     list_filter = (
#         "context",          # ✅ NEW
#         "status",
#         "payment_method",
#     )

#     search_fields = (
#         "user__username",
#         "reference_id",
#     )

#     readonly_fields = (
#         "created_at",
#         "processed_at",
#     )

#     actions = ["approve_payment", "reject_payment"]




from django.contrib import admin
from django.utils import timezone
from .models import PaymentRequest

@admin.register(PaymentRequest)
class PaymentRequestAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "amount",
        "purpose",
        "payment_method",
        "status",
        "created_at",
    )

    list_filter = ("status", "purpose")
    search_fields = ("user__username",)

    actions = ["approve_payment", "reject_payment"]

    def approve_payment(self, request, queryset):
        queryset.update(
            status="approved",
            processed_at=timezone.now()
        )

    def reject_payment(self, request, queryset):
        queryset.update(
            status="rejected",
            processed_at=timezone.now()
        )

    approve_payment.short_description = "Approve selected payments"
    reject_payment.short_description = "Reject selected payments"


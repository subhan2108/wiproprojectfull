from django.contrib import admin
from django.utils import timezone

# Register your models here.
from django.contrib import admin

from wallet.services import apply_payment_to_admin_wallet
from .models import *



# @admin.register(Wallet)
# class WalletAdmin(admin.ModelAdmin):
#     list_display = ("user", "balance", "status", "updated_at")
#     search_fields = ("user__username",)
#     list_filter = ("status",)
#     actions = ["freeze_wallet", "unfreeze_wallet"]


#     def freeze_wallet(self, request, queryset):
#         queryset.update(status="frozen")

#     def unfreeze_wallet(self, request, queryset):
#         queryset.update(status="active")

from wallet.calculations import *


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "tx_type",
        "amount",
        "source",
        "payment_method_used",   # ✅ NEW
        "status",
        "created_at",
    )

    list_filter = ("tx_type", "source", "status")
    search_fields = ("wallet__user__username",)

    # 🔹 DERIVED PAYMENT METHOD (READ ONLY)
    def payment_method_used(self, obj):
        if not obj.reference_id:
            return "-"

        # Try PaymentTransaction first
        pt = PaymentTransaction.objects.filter(id=obj.reference_id).first()
        if pt and pt.payment_method:
            return pt.payment_method.name

        # Fallback: PaymentRequest
        pr = PaymentRequest.objects.filter(id=obj.reference_id).first()
        if pr and pr.payment_method:
            return pr.payment_method.name

        return "-"

    payment_method_used.short_description = "Payment Method"



@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "total_invested",
        "total_withdrawn",
        "total_earned",
        "total_paid",
        "net_balance",
        "bonus_balance",   # 👈 NEW
        "payment_methods_used",  # ✅ NEW
        "status",
        "updated_at",
    )

    search_fields = ("user__username",)
    list_filter = ("status",)
    readonly_fields = (
        "total_invested",
        "total_withdrawn",
        "total_earned",
        "total_paid",
        "net_balance",
        "updated_at",
    )

    fields = (
        "user",
        "bonus_balance",  # 👈 editable
        "status",
        "updated_at",
    )

    # 🔹 CALCULATED FIELDS (READ-ONLY)

    def total_earned(self, obj):
        return calculate_total_earned_for_user(obj.user)

    def total_paid(self, obj):
        return calculate_total_paid_for_user(obj.user)

    def total_invested(self, obj):
        return calculate_total_investment_for_user(obj.user)

    def total_withdrawn(self, obj):
        return calculate_total_withdrawal_for_user(obj.user)
    
    # ✅ THIS IS THE IMPORTANT PART
    def payment_methods_used(self, obj):
        methods = (
            PaymentTransaction.objects
            .filter(user=obj.user, status="approved", payment_method__isnull=False)
            .values_list("payment_method__name", flat=True)
            .distinct()
        )

        return ", ".join(methods) if methods else "-"

    payment_methods_used.short_description = "Payment Methods Used"

    def net_balance(self, obj):
        return calculate_net_balance_for_user(obj.user)

    total_invested.short_description = "Total Invested"
    total_withdrawn.short_description = "Total Withdrawn"
    total_earned.short_description = "Total Earned"
    total_paid.short_description = "Total Paid"
    net_balance.short_description = "Net Balance"






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

    def approve_payment(self, request, queryset):
        for tx in queryset.filter(status="pending"):
            tx.status = "approved"
            tx.processed_at = timezone.now()
            tx.save(update_fields=["status", "processed_at"])

            # 🔥 THIS IS THE ONLY PLACE MONEY MOVES
            apply_payment_to_admin_wallet(tx)

    approve_payment.short_description = "Approve selected payments"

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
        "earned",
        "paid",
        "created_at",
    )

    list_filter = ("status", "purpose")
    search_fields = ("user__username",)

    actions = ["approve_payment", "reject_payment"]

    def approve_payment(self, request, queryset):
        queryset.filter(status="pending").update(
            status="approved",
            processed_at=timezone.now()
        )
    approve_payment.short_description = "Approve selected payment requests"

    def reject_payment(self, request, queryset):
        queryset.update(
            status="rejected",
            processed_at=timezone.now()
        )

    reject_payment.short_description = "Reject selected payment requests"




# @admin.register(AdminWallet)
# class AdminWalletAdmin(admin.ModelAdmin):
#     list_display = (
#         "user",
#         "balance",
#         "total_credit",
#         "total_debit",
#         "updated_at"
#     )
#     readonly_fields = (
#         "balance",
#         "total_credit",
#         "total_debit",
#         "updated_at"
#     )

    
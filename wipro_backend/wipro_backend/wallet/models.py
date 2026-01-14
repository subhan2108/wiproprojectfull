

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
import uuid


class Wallet(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("frozen", "Frozen"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet({self.user.username})"


class WalletTransaction(models.Model):
    TX_TYPE = [
        ("investment", "Investment"),
        ("withdrawal", "Withdrawal"),
        ("interest", "Interest"),
        ("loan_credit", "Loan Credit"),
        ("emi_debit", "EMI Debit"),
        ("admin_adjustment", "Admin Adjustment"),
    ]

    SOURCE = [
        ("system", "System"),
        ("admin", "Admin"),
        ("payment", "Payment"),
    ]

    STATUS = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")

    amount = models.DecimalField(max_digits=15, decimal_places=2)
    tx_type = models.CharField(max_length=30, choices=TX_TYPE)
    source = models.CharField(max_length=20, choices=SOURCE)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")

    reference_id = models.UUIDField(null=True, blank=True)  # investment_id / loan_id / etc
    note = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["wallet", "reference_id", "tx_type", "status"],
                name="unique_wallet_tx_once"
            )
        ]

    def __str__(self):
        return f"{self.tx_type} | {self.amount} | {self.status}"





from django.db import models
from django.contrib.auth.models import User
from committees.models import UserCommittee


class PaymentMethod(models.Model):
    METHOD_TYPE_CHOICES = (
        ("upi", "UPI"),
        ("bank", "Bank Transfer"),
        ("usdt", "USDT / Crypto"),
    )

    name = models.CharField(max_length=100)
    method_type = models.CharField(max_length=20, choices=METHOD_TYPE_CHOICES)

    # Admin provided details
    upi_id = models.CharField(max_length=100, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    account_holder = models.CharField(max_length=100, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    usdt_address = models.CharField(max_length=255, blank=True, null=True)

    # Usage flags
    for_investment = models.BooleanField(default=True)
    for_withdrawal = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.method_type.upper()})"



class PaymentTransaction(models.Model):
    TRANSACTION_TYPE = (
        ("investment", "Investment"),
        ("withdrawal", "Withdrawal"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    due_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
            ("overdue", "Overdue"),
        ],
        default="pending"
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_committee = models.ForeignKey(
    UserCommittee,
    on_delete=models.CASCADE,
    related_name="payments",
    null=True,
    blank=True
)
    
    admin_message = models.TextField(
        blank=True,
        help_text="Message shown to user after approval/rejection"
    )

    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Set by admin on approval"
    )

    reference_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="UPI ref / bank txn id / hash"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    admin_note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    is_recurring = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.user} - {self.amount} ({self.transaction_type}) - {self.user_committee.committee.name} ({self.status})"

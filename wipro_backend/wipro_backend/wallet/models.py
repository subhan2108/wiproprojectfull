

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

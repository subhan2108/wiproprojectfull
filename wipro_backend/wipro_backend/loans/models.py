from django.db import models

# Create your models here.
import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth.models import User


class Loan(models.Model):
    STATUS = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("closed", "Closed"),
        ("defaulted", "Defaulted"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="loans")

    principal = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tenure_months = models.PositiveIntegerField()

    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    started_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

from django.db import models
from datetime import timedelta
from django.contrib.auth.models import User


class Committee(models.Model):
    INVESTMENT_TYPE = (
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
    )

     # 👇 TEMPORARY (to stop Django guessing)
    annual_interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=15
    )

    name = models.CharField(max_length=100)
    investment_type = models.CharField(
    max_length=10,
    choices=INVESTMENT_TYPE,
    default='daily'
)

    investment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    duration_months = models.IntegerField(default=12)

    roi_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=15
    )

    total_slots = models.IntegerField(default=0)

    filled_slots = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def slots_available(self):
        return self.total_slots - self.filled_slots

    def __str__(self):
        return self.name


class UserCommittee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    committee = models.ForeignKey(Committee, on_delete=models.CASCADE)

    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    total_invested = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    roi_earned = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    roi_unlock_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.roi_unlock_date:
            self.roi_unlock_date = self.joined_at + timedelta(days=365)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.committee.name}"


class Investment(models.Model):
    user_committee = models.ForeignKey(
        UserCommittee,
        on_delete=models.CASCADE,
        related_name="investments"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    investment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} on {self.investment_date}"


class Withdrawal(models.Model):
    user_committee = models.ForeignKey(
        UserCommittee,
        on_delete=models.CASCADE,
        related_name="withdrawals"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    is_roi = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)

    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} ({'ROI' if self.is_roi else 'Principal'})"

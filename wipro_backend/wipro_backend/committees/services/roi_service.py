from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta

def get_total_investment(user_committee):
    return (
        user_committee.investment_set
        .aggregate(total=Sum("amount"))
        .get("total") or 0
    )


def calculate_roi_amount(total_investment, roi_percent):
    return (total_investment * roi_percent) / 100


def roi_unlock_date(joined_at):
    return joined_at + timedelta(days=365)


def can_withdraw_roi(user_committee):
    return timezone.now() >= user_committee.roi_unlock_date


def calculate_total_return(user_committee):
    total = get_total_investment(user_committee)
    roi = calculate_roi_amount(
        total,
        user_committee.committee.roi_percent
    )

    return {
        "total_invested": total,
        "roi": roi,
        "total_return": total + roi
    }

from decimal import Decimal
from django.utils.timezone import now
from wallet.services import credit_wallet, debit_wallet
from investments.models import Investment
from .models import Loan


def check_eligibility(user):
    six_months_ago = now() - timedelta(days=180)
    invested = Investment.objects.filter(
        user=user,
        start_date__lte=six_months_ago,
        status="active"
    ).exists()
    return invested


def approve_loan(*, loan: Loan):
    loan.status = "active"
    loan.started_at = now()
    loan.save()

    credit_wallet(
        wallet=loan.user.wallet,
        amount=loan.principal,
        tx_type="loan_credit",
        source="admin",
        reference_id=loan.id,
        note="Loan approved",
    )

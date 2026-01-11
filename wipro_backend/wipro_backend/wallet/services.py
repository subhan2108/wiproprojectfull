from decimal import Decimal
from django.db import transaction as db_tx, IntegrityError
from .models import Wallet, WalletTransaction


@db_tx.atomic
def credit_wallet(
    *,
    wallet: Wallet,
    amount: Decimal,
    tx_type: str,
    source: str,
    note: str = "",
    reference_id: str | None = None,
):
    """
    Credit wallet safely with idempotency.
    """
    # ✅ Idempotency check (code-level)
    if WalletTransaction.objects.filter(
        wallet=wallet,
        reference_id=reference_id,
        tx_type=tx_type,
        status="success",
    ).exists():
        return None  # already processed

    try:
        tx = WalletTransaction.objects.create(
            wallet=wallet,
            amount=amount,
            tx_type=tx_type,
            source=source,
            status="success",
            note=note,
            reference_id=reference_id,
        )

        wallet.balance += amount
        wallet.save(update_fields=["balance"])

        return tx

    except IntegrityError:
        # ✅ DB-level idempotency fallback
        return None


@db_tx.atomic
def debit_wallet(
    *,
    wallet: Wallet,
    amount: Decimal,
    tx_type: str,
    source: str,
    note: str = "",
    reference_id: str | None = None,
):
    """
    Debit wallet safely with idempotency.
    """
    if wallet.status != "active":
        raise ValueError("Wallet is frozen")

    if wallet.balance < amount:
        raise ValueError("Insufficient balance")

    # ✅ Idempotency check
    if WalletTransaction.objects.filter(
        wallet=wallet,
        reference_id=reference_id,
        tx_type=tx_type,
        status="success",
    ).exists():
        return None  # already processed

    try:
        tx = WalletTransaction.objects.create(
            wallet=wallet,
            amount=-amount,
            tx_type=tx_type,
            source=source,
            status="success",
            note=note,
            reference_id=reference_id,
        )

        wallet.balance -= amount
        wallet.save(update_fields=["balance"])

        return tx

    except IntegrityError:
        return None

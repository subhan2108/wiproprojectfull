from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
import json

# Create your views here.
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import WalletTransaction, PaymentTransaction
from .serializers import WalletSerializer, WalletTransactionSerializer


class MyWalletView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletSerializer

    def get_object(self):
        return self.request.user.wallet


class MyWalletTransactionsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletTransactionSerializer

    def get_queryset(self):
        return WalletTransaction.objects.filter(wallet=self.request.user.wallet)



from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from decimal import Decimal
from django.contrib.auth.models import User
from .services import credit_wallet, debit_wallet


class AdminWalletAdjustView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        user_id = request.data.get("user_id")
        amount = Decimal(request.data.get("amount"))
        action = request.data.get("action")  # credit / debit
        note = request.data.get("note", "Admin adjustment")

        user = User.objects.get(id=user_id)
        wallet = user.wallet

        if action == "credit":
            credit_wallet(
                wallet=wallet,
                amount=amount,
                tx_type="admin_adjustment",
                source="admin",
                note=note,
            )
        elif action == "debit":
            debit_wallet(
                wallet=wallet,
                amount=amount,
                tx_type="admin_adjustment",
                source="admin",
                note=note,
            )
        else:
            return Response({"error": "Invalid action"}, status=400)

        return Response({"message": "Wallet updated successfully"})
    





from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from wallet.models import Wallet


class WalletDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)

        return Response({
            "balance": str(wallet.balance),
            "status": wallet.status,
        })







@csrf_exempt
@require_POST
def create_payment_request(request):
    from rest_framework_simplejwt.authentication import JWTAuthentication
    jwt_authenticator = JWTAuthentication()
    auth = jwt_authenticator.authenticate(request)

    if not auth:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    user, _ = auth
    data = json.loads(request.body)

    tx = PaymentTransaction.objects.create(
        user=user,
        user_committee_id=data["user_committee_id"],
        payment_method_id=data["payment_method_id"],
        transaction_type="investment",
    )

    return JsonResponse({
        "id": tx.id,
        "status": tx.status,
    })


from django.http import JsonResponse
from .models import PaymentTransaction

def payment_status(request, pk):
    tx = PaymentTransaction.objects.get(pk=pk, user=request.user)

    return JsonResponse({
        "status": tx.status,
        "amount": float(tx.amount or 0),
        "admin_note": tx.admin_note,
    })




from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view
from wallet.models import *


from django.http import JsonResponse
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from wallet.models import PaymentTransaction
from committees.models import UserCommittee


@api_view(["GET"])
def payment_history(request, user_committee_id):
    # 🔐 JWT AUTH
    jwt_authenticator = JWTAuthentication()
    auth = jwt_authenticator.authenticate(request)

    if not auth:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    user, _ = auth

    # 🔎 Validate UserCommittee ownership
    try:
        user_committee = UserCommittee.objects.get(
            id=user_committee_id,
            user=user
        )
    except UserCommittee.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    # ⏰ AUTO-MARK OVERDUE PAYMENTS (CRITICAL)
    PaymentTransaction.objects.filter(
        user_committee=user_committee,
        status="pending",
        due_at__isnull=False,
        due_at__lt=now()
    ).update(status="overdue")

    # 📜 FETCH PAYMENT HISTORY
    payments = PaymentTransaction.objects.filter(
        user_committee=user_committee
    ).select_related("payment_method").order_by("-created_at")

    data = []
    for p in payments:
        data.append({
            "id": p.id,
            "amount": float(p.amount) if p.amount else 0,
            "payment_method": p.payment_method.name if p.payment_method else None,
            "transaction_type": p.transaction_type,
            "status": p.status,  # pending | approved | rejected | overdue
            "reference_id": p.reference_id,
            "admin_message": p.admin_message,
            "due_at": p.due_at.strftime("%Y-%m-%d %H:%M") if p.due_at else None,
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M"),
        })

    return JsonResponse(data, safe=False)

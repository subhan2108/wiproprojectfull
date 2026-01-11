from django.shortcuts import render

# Create your views here.
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import WalletTransaction
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



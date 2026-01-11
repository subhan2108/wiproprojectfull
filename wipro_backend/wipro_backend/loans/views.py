from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from decimal import Decimal
from .models import Loan
from .services import check_eligibility, approve_loan


class LoanEligibilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        eligible = check_eligibility(request.user)
        return Response({"eligible": eligible})


class ApplyLoanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        loan = Loan.objects.create(
            user=request.user,
            principal=Decimal(request.data["amount"]),
            interest_rate=Decimal("8.0"),
            tenure_months=int(request.data["tenure"]),
        )
        return Response({"message": "Loan application submitted"})


class ApproveLoanView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, loan_id):
        loan = Loan.objects.get(id=loan_id)
        approve_loan(loan=loan)
        return Response({"message": "Loan approved"})

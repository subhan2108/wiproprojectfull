from django.urls import path
from .views import *

urlpatterns = [
    path("eligibility/", LoanEligibilityView.as_view()),
    path("apply/", ApplyLoanView.as_view()),
    path("approve/<uuid:loan_id>/", ApproveLoanView.as_view()),
]

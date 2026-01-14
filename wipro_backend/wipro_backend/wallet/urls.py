from django.urls import path
from .views import MyWalletView, MyWalletTransactionsView, AdminWalletAdjustView
from .views import *
urlpatterns = [
    path("me/", MyWalletView.as_view()),
    path("transactions/", MyWalletTransactionsView.as_view()),
    path("admin/adjust/", AdminWalletAdjustView.as_view()),
    path(
        "payment-request/",
        create_payment_request,
        name="payment-request"
    ),
    path("payment-status/<int:pk>/", payment_status),
    path("payment-history/<int:user_committee_id>/", payment_history),

]

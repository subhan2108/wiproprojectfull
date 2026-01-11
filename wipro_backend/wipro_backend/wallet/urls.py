from django.urls import path
from .views import MyWalletView, MyWalletTransactionsView, AdminWalletAdjustView

urlpatterns = [
    path("me/", MyWalletView.as_view()),
    path("transactions/", MyWalletTransactionsView.as_view()),
    path("admin/adjust/", AdminWalletAdjustView.as_view()),
]

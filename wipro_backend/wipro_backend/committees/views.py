from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import UserCommittee
from .services.roi_service import calculate_total_return


@api_view(["GET"])
def user_roi_view(request, committee_id):
    user_committee = UserCommittee.objects.get(
        user=request.user,
        committee_id=committee_id
    )

    data = calculate_total_return(user_committee)
    return Response(data)
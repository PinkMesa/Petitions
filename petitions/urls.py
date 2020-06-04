from django.urls import include, path
from rest_framework import routers
from . import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

urlpatterns = [
    path('', views.GetAllPetitions.as_view()),
    path('expired/', views.GetLastExpiredPetitions.as_view()),
    path('user/<int:user_id>/', views.UserData.as_view()),
    path('petition/<int:petition_id>/', views.GetSinglePetition.as_view()),
    path('create/', views.CreatePetition.as_view()),
    path('vote/<int:petition_id>/', views.PetitionVote.as_view())
]

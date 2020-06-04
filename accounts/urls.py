from django.urls import include, path
from rest_framework import routers
from . import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

urlpatterns = [
    path('signup', views.UserSignUp.as_view()),
    path('signin', views.UserSignIn.as_view()),
    path('socialsignin', views.UserSocialSignIn.as_view()),
]



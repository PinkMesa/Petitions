from .models import Category, Petition
from .serializers import CategorySerializer, PetitionSerializer
from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework import permissions

class PetitionViewSet(viewsets.ModelViewSet):
    queryset = Petition.objects.all().order_by('created_at')
    serializer_class = PetitionSerializer
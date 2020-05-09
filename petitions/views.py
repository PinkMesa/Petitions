from .models import Category, Petition
from .serializers import CategorySerializer, PetitionSerializer
from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import mixins
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

class PetitionViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):               
    queryset = Petition.objects.all().order_by('created_at')
    serializer_class = PetitionSerializer

    @action(detail=False, url_path='category', methods=['get'])
    def list_by_category(self, request):
        """
        This view should return a list of petitions
        for a given category.
        """
        category_id = request.query_params.get('id')
        filtered_petitions = Petition.objects.filter(category=category_id)
        serializer = PetitionSerializer(filtered_petitions, many=True)
        return Response(serializer.data)

    @action(detail=False, url_path='user', methods=['get'])
    def list_by_user(self, request):
        """
        This view should return a list of petitions
        for the currently authenticated user.
        """
        queryset = request.user.posted_petitions.all()
        serializer = PetitionSerializer(queryset, many=True)
        return Response(serializer.data)

class ReadCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
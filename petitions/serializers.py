from rest_framework import serializers
#vladb commented User
from .models import Petition, Category
from django.contrib.auth.models import Group

#vladb commented userserializer
# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name']

class PetitionSerializer(serializers.ModelSerializer):
    voting_passed = serializers.SerializerMethodField()
    expired = serializers.SerializerMethodField()
    class Meta:
        model = Petition
        fields = ('__all__')
    
    def get_voting_passed(self, obj):
        return obj.voting_passed

    def get_expired(self, obj):
        return obj.expired

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('__all__')
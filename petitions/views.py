from .models import Category, Petition
from .serializers import CategorySerializer, PetitionSerializer
from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import mixins
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json


class GetLastExpiredPetitions(APIView):
    def get(self, request, format=None):
        petitionsList = list()
        petitions = Petition.objects.all()
        for petition in petitions:
            if petition.answer != '':
                petitionsList.append(petition)

        resultList = list()

        for petition in petitionsList:
            resultList.append({'id': petition.id,
                               'title': petition.title,
                               'text': petition.text,
                               'author': {
                                   'id': petition.author.id,
                                   'firstName': petition.author.first_name,
                                   'lastName': petition.author.last_name
                               },
                               'createdAt': petition.created_at,
                               'categoryTitle': petition.category.title,
                               'voteScore': petition.vote_score,
                               'answer': petition.answer})

        return Response({'petitions': resultList}, status=status.HTTP_200_OK)


class GetAllPetitions(APIView):
    def get(self, request, format=None):
        try:
            petitions = Petition.objects.all()
        except Petition.DoesNotExist:
            return Response({'message': 'PETITIONS_DOESNT_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)

        petitionsCount = Petition.objects.count()
        votesCount = 0

        for petition in petitions:
            votesCount += petition.vote_score
        petitionsList = list()

        category = request.GET.get('category')
        authorId = request.GET.get('author')

        if category != '0':
            for petition in petitions:
                if petition.answer == '' and petition.category.id == int(category) and not petition.expired:
                    petitionsList.append(petition)
        elif authorId != '0':
            for petition in petitions:
                if petition.author.id == int(authorId):
                    petitionsList.append(petition)
        else:
            for petition in petitions:
                if petition.answer == '' and not petition.expired:
                    petitionsList.append(petition)

        page = request.GET.get('page')
        paginator = Paginator(petitionsList, 5)
        num_pages = paginator.num_pages

        try:
            petitions = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            petitions = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            petitions = paginator.page(paginator.num_pages)

        resultList = list()

        for petition in petitions:
            resultList.append({'id': petition.id,
                               'title': petition.title,
                               'text': petition.text,
                               'author': {
                                   'id': petition.author.id,
                                   'firstName': petition.author.first_name,
                                   'lastName': petition.author.last_name
                               },
                               'createdAt': petition.created_at,
                               'categoryTitle': petition.category.title,
                               'voteScore': petition.vote_score,
                               'answer': petition.answer})

        return Response({'petitions': resultList, 'numPages': num_pages, 'stats': {'petitionsCount': petitionsCount,
                                                                                       'votesCount': votesCount}},
                        status=status.HTTP_200_OK)


class CreatePetition(APIView):
    def post(self, request, format=None):
        body = json.loads(request.readline())
        try:
            token = request.headers['Token']
        except KeyError:
            return Response({'message': 'TOKEN_DOESNT_PROVIDED'}, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            authorId = Token.objects.get(key=token).user_id
            author = User.objects.get(id=authorId)
            print(body['category'])
            category = Category.objects.get(id=body['category'])
        except Token.DoesNotExist:
            return Response({'message': 'INVALID_TOKEN'}, status=status.HTTP_401_UNAUTHORIZED)
        except Category.DoesNotExist:
            return Response({'message': 'INVALID_CATEGORY'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print('tryyyyyyyyy user id', authorId)
            petition = Petition(title=body['title'],
                                text=body['text'],
                                author=author,
                                created_at=timezone.now(),
                                category=category,
                                vote_score=0,
                                answer='')
            petition.save()
            petitionId = petition.id
            petitionUrl = 'http://127.0.0.1:3000/petitions/' + str(petitionId) + '/'
        finally:
            print('finally')

        return Response({'petitionUrl': petitionUrl}, status=status.HTTP_200_OK)


class GetSinglePetition(APIView):
    def get(self, request, petition_id, format=None):
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            return Response({'message': 'PETITION_NOT_FOUND'}, status=status.HTTP_400_BAD_REQUEST)
        print(petition.title)
        return Response({'petition': {'id': petition.id,
                                      'title': petition.title,
                                      'text': petition.text,
                                      'author': {
                                          'id': petition.author.id,
                                          'firstName': petition.author.first_name,
                                          'lastName': petition.author.last_name
                                      },
                                      'createdAt': petition.created_at,
                                      'categoryTitle': petition.category.title,
                                      'voteScore': petition.vote_score,
                                      'answer': petition.answer}}, status=status.HTTP_200_OK)

class UserData(APIView):
    def get(self, request, user_id, format=None):
        """
        Return a list of all users.
        """
        try:
            user = User.objects.get(id=int(user_id))
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        print(user.first_name)
        return Response({'user': {'id': user.id, 'firstName': user.first_name,
                                  'lastName': user.last_name, 'username': user.username}}, status=status.HTTP_200_OK)

class PetitionVote(APIView):
    def post(self, request, petition_id, format=None):
        body = json.loads(request.readline())
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            return Response({'message': 'PETITION_DOESNT_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = Token.objects.get(key=body['Token']).user_id
            user = User.objects.get(id=user_id)
        except Token.DoesNotExist:
            return Response({'message': 'TOKEN_DOESNT_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'message': 'USER_DOESNT_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)

        voters = petition.voters.all()

        for u in voters:
            if (u == user):
                return Response({'message': 'ALREADY_VOTED'}, status=status.HTTP_400_BAD_REQUEST)

        petition.voters.add(user)
        petition.vote_score += 1
        petition.save()
        return Response(status=status.HTTP_200_OK)

class GetStats(APIView):
    def get(self, request, format=None):


        print('petitions count', petitionsCount)
        return Response({'stats': {'petitionsCount': petitionsCount,
                                      'votesCount': votesCount}}, status=status.HTTP_200_OK)


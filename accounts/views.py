from rest_framework.views import APIView
from django.contrib.auth.models import User
import json
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib import auth
import requests

class UserSignUp(APIView):
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = [user.username for user in User.objects.all()]
        return Response(usernames)

    def post(self, request, format=None):
        requestData = json.loads(request.readline())
        print('request', requestData)

        try:
            userEmailExists = User.objects.get(email=requestData['email'])
        except User.DoesNotExist:
            userEmailExists = None

        if userEmailExists:
            return Response({'message': 'EMAIL_EXISTS'}, status=status.HTTP_409_CONFLICT)

        try:
            userUsernameExists = User.objects.get(username=requestData['username'])
        except User.DoesNotExist:
            userUsernameExists = None

        if userUsernameExists:
            return Response({'message': 'USERNAME_EXISTS'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(username=requestData['username'], email=requestData['email'],
                                        first_name=requestData['firstName'], last_name=requestData['lastName'])
        user.set_password(requestData['password'])
        user.save()
        print('user created from create_user ', user)
        user_id = User.objects.get(email=user.email).id
        is_active = User.objects.get(email=user.email).is_active

        token, created = Token.objects.get_or_create(user=user)

        return Response({
                        'token': token.key,
                        'userId': user_id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'username': user.username,
                        'is_active': is_active,
                         })

class UserSignIn(APIView):
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = [user.username for user in User.objects.all()]
        return Response(usernames)

    def post(self, request, format=None):
        requestData = json.loads(request.readline())
        print('request', requestData)

        try:
            userUsernameExists = User.objects.get(username=requestData['username'])
        except User.DoesNotExist:
            userUsernameExists = None

        if not userUsernameExists:
            return Response({'message': 'USERNAME_DOESNT_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)

        #todo try auth if cant return

        user = auth.authenticate(username=requestData['username'], password=requestData['password'])

        if user is None:
            return Response({'message': 'INVALID_CREDENTIALS'}, status=status.HTTP_406_NOT_ACCEPTABLE)

        #user = User.objects.get(username=requestData.username)

        print('user created from authenticate ', user)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
                        'token': token.key,
                        'userId': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'username': user.username,
                        'is_active': user.is_active,
                         })

class UserSocialSignIn(APIView):
    def post(self, request, format=None):
        requestData = json.loads(request.readline())

        #check for id
        if(requestData['provider'] == 'facebook'):
            r = requests.get(url="https://graph.facebook.com/me", params={'access_token': requestData['socialAuthToken']})
            response = r.json()
            if(response['id'] != requestData['id']):
                return Response({'message': 'FACEBOOK_AUTH_ERROR'}, status=status.HTTP_400_BAD_REQUEST)
        elif(requestData['provider'] == 'google'):
            r = requests.get(url="https://oauth2.googleapis.com/tokeninfo", params={'access_token': requestData['socialAuthToken']})
            data = r.json()
            if(data['sub'] != requestData['id']):
                return Response({'message': 'GOOGLE_AUTH_ERROR'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=requestData['email'])
        except User.DoesNotExist:
            user = None

        if user is None:
            user = User.objects.create_user(username=requestData['username'], email=requestData['email'],
                                        first_name=requestData['firstName'], last_name=requestData['lastName'])
            user.set_password(User.objects.make_random_password())
            user.save()

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'userId': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'is_active': user.is_active,
        })

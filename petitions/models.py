from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
import uuid

VOTES_TO_PASS = 200
EXPIRY_TIME_WEEKS = 2

# Model for possible future changes
class User(AbstractUser):
    pass

class Category(models.Model):
    title = models.CharField(max_length = 30)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['title']
    
    def __str__(self):
        return self.title

class Petition(models.Model):
    title = models.CharField(max_length=100, unique=True)
    text = models.CharField(max_length=500)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posted_petitions")
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    vote_score = models.IntegerField(default=0)
    voters = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="voted_petitions")
    url = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    class Meta:
        verbose_name_plural = "Petitions"
        ordering = ['created_at']


    def __str__(self):
        return self.title

    # If votes is enough to pass
    @property
    def voting_passed(self):
        return self.vote_score > VOTES_TO_PASS

    # True if vote is expired
    @property
    def expired(self):
        return  timezone.now()  > timedelta(weeks=EXPIRY_TIME_WEEKS) + self.created_at
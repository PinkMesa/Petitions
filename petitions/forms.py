from django.forms import ModelForm
from .models import Petition


class PetitionsForm(ModelForm):
    class Meta:
        model = Petition
        fields = ['category', 'title', 'text']
from django.contrib import admin

from .models import MusicTrack
from .models import Category

admin.site.register(Category)
admin.site.register(MusicTrack)
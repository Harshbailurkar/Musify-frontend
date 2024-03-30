from rest_framework import serializers
from .models import MusicTrack

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicTrack
        fields = ['id', 'title', 'category', 'play_count', 'url', 'thumbnail_url', 'duration']

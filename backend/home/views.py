from rest_framework import generics
from .models import MusicTrack
from .serializers import TrackSerializer

class TopTracksByCategoryAPIView(generics.ListAPIView):
    serializer_class = TrackSerializer

    def get_queryset(self):
        category = self.kwargs['category']
        return MusicTrack.objects.filter(category__name=category).order_by('-play_count')[:10]

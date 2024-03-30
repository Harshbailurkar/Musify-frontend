from django.urls import path
from .views import TopTracksByCategoryAPIView

urlpatterns = [
    path('api/tracks/<str:category>/', TopTracksByCategoryAPIView.as_view(), name='track-list'),
]

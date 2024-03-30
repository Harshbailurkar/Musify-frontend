from django.db import models
from mutagen.mp3 import MP3
from io import BytesIO
import requests

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class MusicTrack(models.Model):
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    play_count = models.IntegerField(default=0)
    url = models.URLField()
    thumbnail_url = models.URLField()
    duration = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.duration:
            self.duration = self.get_duration()
        super().save(*args, **kwargs)

    def get_duration(self):
        response = requests.get(self.url)
        if response.status_code == 200:
            mp3_data = BytesIO(response.content)
            audio = MP3(mp3_data)
            return audio.info.length
        else:
            raise Exception("Failed to fetch MP3 file")

    def __str__(self):
        return self.title

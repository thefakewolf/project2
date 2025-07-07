from django.db import models

# Create your models here.

class Item(models.Model):
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    image = models.URLField(blank=True)
    wanted_items = models.CharField(max_length=200, blank=True, help_text='Comma separated list')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

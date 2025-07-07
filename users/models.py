from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    profile_image = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('fashion', 'Fashion'),
        ('home', 'Home'),
        ('books', 'Books'),
        ('sports', 'Sports'),
        ('toys', 'Toys'),
        ('others', 'Others'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('exchanged', 'Exchanged'),
        ('pending', 'Pending'),
    ]
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='others')
    image = models.URLField()
    wanted_items = models.TextField(help_text='Comma separated list of wanted items')
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    can_sell = models.BooleanField(default=False)
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def wanted_items_list(self):
        return [item.strip() for item in self.wanted_items.split(',') if item.strip()]

class ProductLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

class ChatRoom(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='chat_rooms', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        participants_names = ', '.join([user.username for user in self.participants.all()])
        return f"Chat: {participants_names}"

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"

# Keep the original Item model for backward compatibility
class Item(models.Model):
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    image = models.URLField(blank=True)
    wanted_items = models.CharField(max_length=200, blank=True, help_text='Comma separated list')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
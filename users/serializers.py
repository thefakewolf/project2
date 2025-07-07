from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, ChatRoom, Message, ProductLike

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'profile_image', 'phone_number', 'location', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    wanted_items_list = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'owner', 'title', 'description', 'category', 'image', 
                 'wanted_items', 'wanted_items_list', 'location', 'status', 
                 'can_sell', 'likes_count', 'is_liked', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'likes_count', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProductLike.objects.filter(user=request.user, product=obj).exists()
        return False

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    product = ProductSerializer(read_only=True)
    last_message = MessageSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'participants', 'product', 'last_message', 
                 'unread_count', 'other_participant', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            other_participants = obj.participants.exclude(id=request.user.id)
            if other_participants.exists():
                return UserSerializer(other_participants.first()).data
        return None
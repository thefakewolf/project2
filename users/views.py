from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Product, ChatRoom, Message, ProductLike, Item
from .serializers import (
    UserSerializer, ProductSerializer, ChatRoomSerializer, 
    MessageSerializer
)

User = get_user_model()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def item_list(request):
    """Legacy endpoint for backward compatibility"""
    items = Item.objects.all().order_by('-created_at')
    data = [
        {
            'id': item.id,
            'title': item.title,
            'location': item.location,
            'image': item.image,
            'wanted_items': item.wanted_items.split(',') if item.wanted_items else [],
            'created_at': item.created_at.isoformat(),
        }
        for item in items
    ]
    return Response(data)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class MyProductsView(generics.ListCreateAPIView):
    """List user's products and create new products"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific product"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

class AllProductsView(generics.ListAPIView):
    """List all available products"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(status='available').exclude(owner=self.request.user)

class MyChatRoomsView(generics.ListAPIView):
    """List user's chat rooms"""
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(participants=self.request.user).order_by('-updated_at')

class ChatRoomDetailView(generics.RetrieveAPIView):
    """Get specific chat room details"""
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(participants=self.request.user)

class ChatMessagesView(generics.ListCreateAPIView):
    """List messages in a chat room and send new messages"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_room_id = self.kwargs['chat_room_id']
        chat_room = get_object_or_404(ChatRoom, id=chat_room_id, participants=self.request.user)
        return Message.objects.filter(chat_room=chat_room).order_by('created_at')

    def perform_create(self, serializer):
        chat_room_id = self.kwargs['chat_room_id']
        chat_room = get_object_or_404(ChatRoom, id=chat_room_id, participants=self.request.user)
        serializer.save(sender=self.request.user, chat_room=chat_room)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_product_like(request, product_id):
    """Toggle like/unlike for a product"""
    product = get_object_or_404(Product, id=product_id)
    like, created = ProductLike.objects.get_or_create(
        user=request.user, 
        product=product
    )
    
    if not created:
        like.delete()
        product.likes_count = max(0, product.likes_count - 1)
        liked = False
    else:
        product.likes_count += 1
        liked = True
    
    product.save()
    
    return Response({
        'liked': liked,
        'likes_count': product.likes_count
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_chat_room(request):
    """Create or get existing chat room between users for a product"""
    product_id = request.data.get('product_id')
    product = get_object_or_404(Product, id=product_id)
    
    # Don't allow chat with own product
    if product.owner == request.user:
        return Response(
            {'error': 'Cannot create chat room with your own product'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if chat room already exists
    existing_room = ChatRoom.objects.filter(
        participants=request.user
    ).filter(
        participants=product.owner
    ).filter(
        product=product
    ).first()
    
    if existing_room:
        serializer = ChatRoomSerializer(existing_room, context={'request': request})
        return Response(serializer.data)
    
    # Create new chat room
    chat_room = ChatRoom.objects.create(product=product)
    chat_room.participants.add(request.user, product.owner)
    
    serializer = ChatRoomSerializer(chat_room, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_messages_read(request, chat_room_id):
    """Mark all messages in a chat room as read"""
    chat_room = get_object_or_404(ChatRoom, id=chat_room_id, participants=request.user)
    
    # Mark all messages from other users as read
    Message.objects.filter(
        chat_room=chat_room,
        is_read=False
    ).exclude(sender=request.user).update(is_read=True)
    
    return Response({'success': True})
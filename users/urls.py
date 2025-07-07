from django.urls import path
from .views import (
    item_list, UserProfileView, MyProductsView, ProductDetailView,
    AllProductsView, MyChatRoomsView, ChatRoomDetailView, 
    ChatMessagesView, toggle_product_like, create_chat_room,
    mark_messages_read
)

urlpatterns = [
    # Legacy endpoint
    path('items/', item_list, name='item-list'),
    
    # User endpoints
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Product endpoints
    path('api/my-products/', MyProductsView.as_view(), name='my-products'),
    path('api/my-products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/products/', AllProductsView.as_view(), name='all-products'),
    path('api/products/<int:product_id>/like/', toggle_product_like, name='toggle-product-like'),
    
    # Chat endpoints
    path('api/my-chats/', MyChatRoomsView.as_view(), name='my-chats'),
    path('api/chats/<int:pk>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),
    path('api/chats/<int:chat_room_id>/messages/', ChatMessagesView.as_view(), name='chat-messages'),
    path('api/chats/<int:chat_room_id>/mark-read/', mark_messages_read, name='mark-messages-read'),
    path('api/chats/create/', create_chat_room, name='create-chat-room'),
]
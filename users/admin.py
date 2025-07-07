from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Product, ChatRoom, Message, ProductLike, Item

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'firebase_uid', 'location', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'created_at')
    search_fields = ('username', 'email', 'firebase_uid')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('firebase_uid', 'profile_image', 'phone_number', 'location')
        }),
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'status', 'likes_count', 'created_at')
    list_filter = ('category', 'status', 'can_sell', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    readonly_fields = ('likes_count', 'created_at', 'updated_at')

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'created_at')
    list_filter = ('created_at',)
    filter_horizontal = ('participants',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'chat_room', 'content', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('content', 'sender__username')

@admin.register(ProductLike)
class ProductLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'location')
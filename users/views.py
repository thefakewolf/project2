from django.shortcuts import render
from django.http import JsonResponse
from .models import Item

# Create your views here.

def item_list(request):
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
    return JsonResponse(data, safe=False)

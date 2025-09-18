# orders/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer

@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    order = serializer.save()
    return Response({
        'order_number': order.order_number,
        'total': str(order.total_price),
        'created_at': order.created_at
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_order(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)
    data = OrderSerializer(order).data
    return Response(data)

@api_view(['GET'])
def order_count(request):
    return Response({'total_orders': Order.objects.count()})

@api_view(['GET'])
def list_orders(request):
    qs = Order.objects.order_by('-created_at')[:50]
    data = OrderSerializer(qs, many=True).data
    return Response({'orders': data})



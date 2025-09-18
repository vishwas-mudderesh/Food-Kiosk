# orders/serializers.py
from decimal import Decimal
from rest_framework import serializers
from .models import Order

class OrderItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    price = serializers.FloatField()
    quantity = serializers.IntegerField(min_value=1)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['order_number', 'items', 'total_price', 'created_at']
        read_only_fields = ['order_number', 'total_price', 'created_at']

    def create(self, validated_data):
        items = validated_data.pop('items')
        total = sum(Decimal(str(i['price'])) * i['quantity'] for i in items)
        return Order.objects.create(items=items, total_price=total)

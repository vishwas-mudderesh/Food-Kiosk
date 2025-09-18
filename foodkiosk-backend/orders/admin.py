from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'total_price', 'created_at')
    search_fields = ('order_number',)
    ordering = ('-created_at',)


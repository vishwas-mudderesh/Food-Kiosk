# orders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('orders/count/', views.order_count),
    path('orders/list/', views.list_orders),
    path('orders/<str:order_number>/', views.get_order),
    path('orders/', views.create_order),
]


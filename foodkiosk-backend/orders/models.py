from django.db import models
import uuid


class Order(models.Model):
    order_number = models.CharField(max_length=20 , unique=True , editable=False)
    items = models.JSONField()
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at=models.DateTimeField(auto_now_add=True)

    def save(self,*args,**kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args,**kwargs)

    def __str__(self):
        return f"{self.order_number} - {self.total_price}"


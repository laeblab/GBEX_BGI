from django.db import models
from .models import GBEXModelBase, default_order

menu_label = "Purchasing"


class Transaction(GBEXModelBase):
	what = models.TextField()
	price = models.PositiveIntegerField()
	menu_label = menu_label
	symbol = "TRA"
	order = [*default_order, 'what', 'price']
